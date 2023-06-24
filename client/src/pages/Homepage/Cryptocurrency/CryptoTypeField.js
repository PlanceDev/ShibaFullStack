import React, { useEffect, useCallback, useContext } from "react";
import { chainData } from "../../../constant/parsedAbi";
import PropTypes from "prop-types";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { palette } from "../../../themes";
import { cryptoTypes, networks } from "../../../config/wallet_config";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../../store/User";
import { setCurrentChain } from "../../../store/Chain";
import { Context } from "../../../context/AppContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box key={index} sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const CryptoTypeField = () => {
  const currentUser = useSelector((state) => state.user);
  const currentChain = useSelector((state) => state.chain);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const { setSelectedIcon, selectedIcon } = useContext(Context);

  // Handle Token Change
  const tokenPicker = async (chain) => {
    const selectedChain = chainData.filter((obj) => obj.hasOwnProperty(chain));

    console.log(selectedChain[0][chain]);

    // Handles _raiser naming error from previous dev's spaghetti code - TODO: Remove this when we have time
    const handleNamingErrorIssue = () => {
      if (selectedChain[0][chain] === currentChain.contract) {
        if (chain === "s_Raiser") {
          return process.env.REACT_APP_WETH_CONTRACT;
        }

        if (chain === "a_Raiser") {
          return process.env.REACT_APP_WARB_CONTRACT;
        }

        if (chain === "b_Raiser") {
          return process.env.REACT_APP_WBSC_CONTRACT;
        }
      }

      return selectedChain[0][chain];
    };

    const handleABIErrorIssue = () => {
      if (selectedChain[0][chain] === currentChain.contract) {
        if (chain === "s_Raiser") {
          return chainData.filter((obj) => obj.hasOwnProperty("s_WETH"))[0][
            "abi"
          ];
        }

        if (chain === "a_Raiser") {
          return chainData.filter((obj) => obj.hasOwnProperty("a_WETH"))[0][
            "abi"
          ];
        }

        if (chain === "b_Raiser") {
          return chainData.filter((obj) => obj.hasOwnProperty("b_WBNB"))[0][
            "abi"
          ];
        }
      }

      return selectedChain[0]["abi"];
    };

    dispatch(
      setCurrentChain({
        tokenSymbol: chain,
        tokenAbi: handleABIErrorIssue(),
        tokenContract: handleNamingErrorIssue(),
      })
    );
  };

  // Handle network change
  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case 0:
        dispatch(
          setCurrentChain({
            name: "Sepolia test network",
            network: "sepolia",
            cryptoType: "s_Raiser",
            chainId: "0xaa36a7",
            chainNumber: 11155111,
            contract: process.env.REACT_APP_ETH_CONTRACT,
            tokenContract: process.env.REACT_APP_WETH_CONTRACT,
            tokenSymbol: "s_Raiser",
            tokenAbi: chainData.filter((obj) =>
              obj.hasOwnProperty("s_WETH")
            )[0]["abi"],
            currentPrice: 0,
            nextPrice: 0,
            rpcUrl: process.env.REACT_APP_ETH_RPC,
          })
        );
        break;
      case 1:
        dispatch(
          setCurrentChain({
            name: "Binance Smart Chain Testnet",
            network: "bsc",
            cryptoType: "b_Raiser",
            chainId: "0x61",
            chainNumber: 97,
            contract: process.env.REACT_APP_BSC_CONTRACT,
            tokenContract: process.env.REACT_APP_WBSC_CONTRACT,
            tokenSymbol: "b_Raiser",
            tokenAbi: chainData.filter((obj) =>
              obj.hasOwnProperty("b_WBNB")
            )[0]["abi"],
            currentPrice: 0,
            nextPrice: 0,
            rpcUrl: process.env.REACT_APP_BSC_RPC,
          })
        );
        break;
      case 2:
        dispatch(
          setCurrentChain({
            name: "Arbitrum Testnet",
            network: "arbitrum",
            cryptoType: "a_Raiser",
            chainId: "0x66eed",
            chainNumber: 421613,
            contract: process.env.REACT_APP_ARB_CONTRACT,
            tokenContract: process.env.REACT_APP_WARB_CONTRACT,
            tokenSymbol: "a_Raiser",
            tokenAbi: chainData.filter((obj) =>
              obj.hasOwnProperty("a_WETH")
            )[0]["abi"],
            currentPrice: 0,
            nextPrice: 0,
            rpcUrl: process.env.REACT_APP_ARB_RPC,
          })
        );
        break;
      default:
        break;
    }
  };

  // useEffect(() => {
  //   if (window.ethereum) {
  //     handleDefaultSwitch("sepolia");
  //     window.ethereum.on("chainChanged", networkChanged);

  //     return () => {
  //       window.ethereum.removeListener("chainChanged", networkChanged);
  //     };
  //   }
  // }, [networkChanged]);

  return (
    <>
      {/* Select chain and show available tokens for each chain */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            textColor="secondary"
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: palette.common.brown,
              },
            }}
          >
            <StyledTab key={"eth"} label="Ethereum" {...a11yProps(0)} />
            <StyledTab key={"bsc"} label="BSC" {...a11yProps(1)} />
            <StyledTab key={"arb"} label="Arbitrum" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Token Options */}
        <Box
          display={{ sm: "flex", xs: "flex" }}
          justifyContent={"center"}
          alignItems={"center"}
          flexWrap={"wrap"}
          gap={4}
          marginTop={4}
        >
          {cryptoTypes
            .filter((token) => token.networkType === currentChain.network)
            .map((item, i) => (
              <Button
                key={item.type}
                onClick={() => tokenPicker(item.type)}
                sx={{
                  width: "110px",
                  background:
                    currentChain.tokenSymbol === item.type
                      ? palette.common.white
                      : "",
                  border: "2px solid #3C2C2D",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  "&:hover": {
                    background: "#f6e1ce",
                  },
                }}
              >
                <Box
                  component={"img"}
                  alt=""
                  src={
                    currentChain.tokenSymbol !== item.type
                      ? item.symbol
                      : item.symbol1
                  }
                />
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color:
                        currentChain.tokenSymbol === item.type
                          ? palette.common.black
                          : "#8C7662",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#8C7662 !important",
                    }}
                  >
                    {item.token}
                  </Typography>
                </Box>
              </Button>
            ))}
        </Box>
      </Box>
    </>
  );
};

const StyledTab = styled(Tab)`
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  color: #8c7662 !important;
  font-weight: 600;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: #8c7662 !important;
  }

  /* change indicator color */
  &.Mui-selected {
    color: black !important;
  }
`;
