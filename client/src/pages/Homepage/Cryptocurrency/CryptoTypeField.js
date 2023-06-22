import React, { useEffect, useCallback } from "react";
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
        <Box sx={{ p: 3 }}>
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

export const CryptoTypeField = ({ cryptoType }) => {
  const currentUser = useSelector((state) => state.user);
  const currentChain = useSelector((state) => state.chain);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);

  // Handle Token Change
  const tokenPicker = async (chain) => {
    const selectedChain = chainData.filter((obj) => obj.hasOwnProperty(chain));

    dispatch(
      setCurrentChain({
        tokenSymbol: chain,
        tokenAbi: selectedChain[0]["abi"],
        tokenContract: selectedChain[0][chain],
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
            name: "Sepolia",
            network: "sepolia",
            cryptoType: "s_Raiser",
            chainId: "0xaa36a7",
            chainNumber: 11155111,
            contract: "0xa504fe0f0af7ee985cede1e72363d644adf40314",
            tokenContract: "0x99e78fbcfa087f72ddc927aa35da148518416959",
            tokenSymbol: "s_Raiser",
            tokenAbi: [],
            currentPrice: 0,
            nextPrice: 0,
            rpcUrl: "https://rpc2.sepolia.org",
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
            contract: "0x7bda4bff3d604aeb76b8ca825ecf66e1037c8262",
            tokenContract: "0x8a9043da48f2ec50a35cef0ec26932e61db1b2a3",
            tokenSymbol: "b_Raiser",
            tokenAbi: [],
            currentPrice: 0,
            nextPrice: 0,
            rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
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
            contract: "0x56f683b9d6eb6a8ef1d3fab1d335531414395ec2",
            tokenContract: "0xb942face0d4fe5724d0192f6999c5192a53450ee",
            tokenSymbol: "a_Raiser",
            tokenAbi: [],
            currentPrice: 0,
            nextPrice: 0,
            rpcUrl: "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
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
            <StyledTab label="Ethereum" {...a11yProps(0)} />
            <StyledTab label="BSC" {...a11yProps(1)} />
            <StyledTab label="Arbitrum" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Token Options */}
        <Box
          display={{ sm: "flex", xs: "none" }}
          justifyContent={"center"}
          alignItems={"center"}
          flexWrap={"wrap"}
          gap={4}
          marginTop={4}
        >
          {cryptoTypes
            .filter((token) => token.networkType === currentChain.network)
            .map((item, i) => (
              <>
                <Button
                  key={i}
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
              </>
            ))}
        </Box>
      </Box>

      {/* <Box display={{ sm: "none", xs: "block" }}>
        <FormControl sx={{ width: "100%" }}>
          <Select
            sx={{
              border: "2px solid #202025",
              borderRadius: "4px",
            }}
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            value={cryptoType}
            // onChange={handleChange}
            MenuProps={MenuProps}
          >
            {cryptoTypes.map((item, i) => (
              <MenuItem
                key={i}
                value={item.type}
                // onClick={() => setSelectedTokenIcon(item.symbol1)}
              >
                <Box
                  display={"flex"}
                  justifyContent={"cemter"}
                  alignItems={"center"}
                  gap={2}
                >
                  <Box component={"img"} src={item.symbol1} alt="" />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        color: palette.common.black,
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
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box> */}
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
