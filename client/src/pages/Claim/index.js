import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Box, Grid, Typography, Button, Tabs, Tab } from "@mui/material";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";

import { mainContractAbi } from "../../constant/mainContractAbi";

import styled from "styled-components";
import { chainData } from "../../constant/parsedAbi";
import { useSelector, useDispatch } from "react-redux";
import { Context } from "../../context/AppContext";
import { setCurrentUser } from "../../store/User";
import { setCurrentChain } from "../../store/Chain";
import { toast } from "react-toastify";

import { palette } from "../../themes";
import { ethers } from "ethers";
import Web3 from "web3";

import FAQ_icon from "../../assets/images/FAQ/FAQ_DOG.png";

import { InputField } from "../../components/InputField";

import {
  getPrice,
  getNextPrice,
  getTimeStamp,
  getRaised,
  getPoints,
  getBalance,
  getDecimals,
} from "../Homepage/utils";

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

export const Claim = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState({});
  const { setOpenModal } = useContext(Context);

  const currentUser = useSelector((state) => state.user);
  const currentChain = useSelector((state) => state.chain);

  const [amount, setAmount] = useState("");
  const [value, setValue] = useState(0);

  const handleAmountChange = (e) => {
    if (isNaN(e.target.value)) return;

    setAmount(e.target.value);
  };

  useEffect(() => {
    let provider = new ethers.providers.Web3Provider(
      new Web3.providers.HttpProvider(currentChain.rpcUrl)
    );

    getPoints(
      currentChain.contract,
      provider,
      dispatch,
      currentUser,
      setCurrentUser
    );
  }, [currentUser.address, currentChain.contract]);

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
            chainId: process.env.REACT_APP_ETH_CHAIN_ID,
            chainNumber: process.env.REACT_APP_ETH_CHAIN_NUMBER,
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
            name: "Binance Smart Chain",
            network: "bsc",
            cryptoType: "b_Raiser",
            chainId: process.env.REACT_APP_BSC_CHAIN_ID,
            chainNumber: process.env.REACT_APP_BSC_CHAIN_NUMBER,
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
            name: "Arbitrum",
            network: "arbitrum",
            cryptoType: "a_Raiser",
            chainId: process.env.REACT_APP_ARB_CHAIN_ID,
            chainNumber: process.env.REACT_APP_ARB_CHAIN_NUMBER,
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

  // Switch chain on the users wallet to complete the purchase
  const setChainId = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request access to MetaMask
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      return await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `${currentChain.chainId.toString(16)}` }],
        })
        .then((res) => {
          return true;
        })
        .catch((error) => {
          console.error("Error switching chain:", error);
          toast.error(
            `Error switching chain! Please add ${currentChain.name} - chainId ${currentChain.chainNumber} to your wallet.`
          );
          return false;
        });
    } catch (err) {
      console.log("set chain error", err);
    }
  };

  const handleClaimNow = async () => {
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (amount > Number(currentUser.points)) {
      toast.error("Amount can not be greater than your points balance.");
      return;
    }

    const isChainSet = await setChainId();

    if (!isChainSet) return;

    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(
        currentChain.contract,
        mainContractAbi,
        provider.getSigner()
      );

      const tx = await contract.claim(currentUser.address, 10, [], {
        gasLimit: 500000,
      });

      const receipt = await tx.wait();
      console.log("Transaction receipt");
      console.log(receipt);

      getPoints(
        currentChain.contract,
        provider,
        dispatch,
        currentUser,
        setCurrentUser
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "1440px",
        margin: "auto",
      }}
    >
      <Grid container>
        <Grid
          item
          sm={6}
          xs={12}
          sx={{
            background: "#F8CAA0",
            position: "relative",
            height: { sm: "initial", xs: "550px" },
          }}
        >
          <Box p={{ md: 20, sm: 10, xs: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { md: 72, sm: 56, xs: 48 },
                lineHeight: { sm: "96px", xs: "48px" },
              }}
            >
              Claim
            </Typography>
            <Button
              sx={{
                width: { sm: "192px", xs: "120px" },
                height: { sm: "72px", xs: "35px" },
                background: "#FE6768",
                borderRadius: { sm: "48px", xs: "30px" },
                marginTop: { sm: "20px", xs: "12px" },
                "&:hover": {
                  background: "#e03738",
                },
              }}
            >
              <TrendingFlatOutlinedIcon
                sx={{
                  fontSize: { sm: 80, xs: 60 },
                  color: palette.common.black,
                }}
              />
            </Button>
          </Box>
          <Box
            component={"img"}
            alt=""
            src={FAQ_icon}
            sx={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          />
        </Grid>
        {/* End Left screen */}

        <Grid
          item
          sm={6}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // background: "#a3a3a3",
            height: { sm: "initial", xs: "auto" },
            padding: { sm: 10, xs: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { md: 72, sm: 56, xs: 48 },
                lineHeight: { sm: "96px", xs: "48px" },
              }}
            >
              Claim Points
            </Typography>

            {currentUser.address && (
              <>
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

                <Box display={"flex"} flexDirection={"column"}>
                  <Typography
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={"300px"}
                    mb={4}
                    variant="h5"
                    sx={{
                      color: "#555555 !important",
                      fontSize: 14,
                    }}
                  >
                    <span>Claim Amount</span>

                    <span>Points: {currentUser.points}</span>
                  </Typography>

                  <InputField
                    handleChange={handleAmountChange}
                    inputValue={amount}
                  />
                </Box>

                <Button
                  variant="h5"
                  onClick={handleClaimNow}
                  sx={{
                    width: "300px",
                    border: "2px solid #555555",
                    borderRadius: "4px",
                    padding: "12px 32px",
                    fontWeight: 600,
                    background: "#3c2c2d",
                    color: "#fff",
                    "&:hover": {
                      transition: "all 0.3s ease-in-out",
                      color: "#fff",
                      background: "#3c2c2d",
                    },
                  }}
                >
                  Claim Now
                </Button>
              </>
            )}

            {!currentUser.address && (
              <Button
                variant="h5"
                onClick={() => setOpenModal(true)}
                sx={{
                  border: "2px solid #555555",
                  borderRadius: "4px",
                  padding: "12px 32px",
                  fontWeight: 600,
                  "&:hover": {
                    background: "#ffe8d4",
                    transition: 0.3,
                  },
                }}
              >
                CONNECT WALLET
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
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

{
  /* <Button
              variant="h5"
              onClick={() => setOpenModal(true)}
              sx={{
                border: "2px solid #555555",
                borderRadius: "4px",
                padding: "12px 32px",
                fontWeight: 600,
                "&:hover": {
                  background: "#ffe8d4",
                  transition: 0.3,
                },
              }}
            >
              CONNECT WALLET
            </Button> */
}
