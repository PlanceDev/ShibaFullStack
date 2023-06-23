import React, { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import { ethers, BigNumber } from "ethers";
import Web3 from "web3";
import { getPoints, getBalance } from "../utils";
import {
  CryptoTypeField,
  TokenBalanceField,
  DurationField,
  RaisedField,
  ValueTypeField,
  Referral,
} from "./";

import { CustomButton } from "../../../components/CustomButton";
import { Context } from "../../../context/AppContext";
import { useSelector, useDispatch } from "react-redux";
import { mainContractAbi } from "../../../constant/mainContractAbi";
import { setCurrentUser } from "../../../store/User";

import headerImg from "../../../assets/images/home/header-img.png";
import a_eth from "../../../assets/images/home/a_eth.png";

const styles = { width: "100%" };

export const Cryptocurrency = () => {
  const {
    setOpenModal,
    setCurrentChainId,
    currentChainId,
    // contract,
    // tokenContract,
    points,
    tokenBalance,
    currentPrice,
    nextPrice,
    timerValue,
    cryptoType,
    setCryptoType,
    raiseValue,
    walletAddress,
    setChainStatus,
    chainStatus,
    referralCode,
    referralLink,
    setReferralLink,
  } = useContext(Context);
  const [selectedTokenIcon, setSelectedTokenIcon] = useState(a_eth);
  const [buyValue, setBuyValue] = useState(0);
  const [pointsValue, setPointsValue] = useState(0);

  const currentChain = useSelector((state) => state.chain);
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleOpenModalClick = () => {
    setOpenModal(true);
  };

  // Switch chain on the users wallet to complete the purchase
  const setChainId = async () => {
    try {
      if (!currentChain.chainNumber || !currentChain.network) {
        return;
      }

      const setNetworkNativeToken = async () => {
        if (currentChain.network === "sepolia") {
          return "ETH";
        } else if (currentChain.network === "bsc") {
          return "tBNB";
        } else if (currentChain.network === "arbitrum") {
          return "AGOR";
        } else {
          return "ETH";
        }
      };

      const nativeToken = await setNetworkNativeToken();

      return await window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${currentChain.chainNumber.toString(16)}`,
              rpcUrls: [currentChain.rpcUrl],
              chainName: currentChain.name,
              nativeCurrency: {
                name: currentChain.network,
                symbol: nativeToken,
                decimals: 18,
              },
            },
          ],
        })
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error("Error setting chain ID:", error);
          return false;
        });
    } catch (err) {
      console.log("set chain error", err);
    }
  };

  // Send referral data to the server
  const sendDataToServer = async (res) => {
    try {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/contribute/`,
          {
            address: currentUser.address,
            blockHash: res.blockHash,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res);
          // Update the user's balance and points

          let provider = new ethers.providers.Web3Provider(window.ethereum);
          // getBalance(currentChain, provider, dispatch, setCurrentUser);

          getPoints(
            currentChain.contract,
            provider,
            dispatch,
            currentUser,
            setCurrentUser
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuyNowClick = async () => {
    try {
      const isChainSet = await setChainId();

      if (!isChainSet) {
        console.log("chain not set.");
        return;
      }

      if (!buyValue || buyValue <= 0) {
        console.log("Amount value must be greater than 0.");
        return;
      }

      let value = window.web3.utils.toWei(buyValue.toString(), "ether");
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let nativeTokens = ["s_Raiser", "a_Raiser", "b_Raiser"];
      const contract = await new window.web3.eth.Contract(
        mainContractAbi,
        currentChain.contract
      );

      //  Request approval for non-native tokens
      if (!nativeTokens.includes(currentChain.tokenSymbol)) {
        const tokenContract = new ethers.Contract(
          currentChain.tokenContract,
          currentChain.tokenAbi,
          provider.getSigner()
        );

        if (
          currentChain.tokenSymbol.endsWith("USDC") ||
          currentChain.tokenSymbol.endsWith("USDT")
        ) {
          value = ethers.utils.parseUnits(buyValue.toString(), 6);
        }

        if (currentChain.tokenSymbol.endsWith("BTC")) {
          value = ethers.utils.parseUnits(buyValue.toString(), 8);
        }

        if (currentChain.tokenSymbol.startsWith("b_")) {
          value = window.web3.utils.fromWei(buyValue.toString(), "ether");
        }

        // Check if the user has approved the contract to spend their tokens
        const tokenAllowance = await tokenContract.allowance(
          currentUser.address,
          currentChain.contract
        );

        // If the user has not approved the contract to spend their tokens, request approval
        if (Number(tokenAllowance.toString()) <= value) {
          await tokenContract.approve(currentChain.contract, value);
        }

        const contributionResult = await contract.methods
          .contribute(currentChain.tokenContract, value, referralCode)
          .send({
            from: currentUser.address,
            gasLimit: 500000,
          });

        sendDataToServer(contributionResult);
      } else {
        const contributionResult = await contract.methods
          .contribute(currentChain.tokenContract, 0, referralCode)
          .send({
            from: currentUser.address,
            value,
          });

        sendDataToServer(contributionResult);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        background: "#f1f4f4",
      }}
    >
      <Box
        id="buy$ART"
        sx={{
          maxWidth: "1440px",
          margin: "auto",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            sm={6}
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{}}
          >
            <Box
              component={"img"}
              src={headerImg}
              alt=""
              sx={{}}
              width={"100%"}
            />
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
            display="flex"
            flexDirection="column"
            justifyContent={"space-between"}
            sx={{
              background: "#F8CAA0",
              padding: {
                md: "24px 48px !important",
                sm: "24px 32px !important",
                xs: "24px 16px 24px 24px !important",
              },
            }}
          >
            <Box>
              <CryptoTypeField
                cryptoType={cryptoType}
                setCurrentChainId={setCurrentChainId}
                currentChainId={currentChainId}
                setCryptoType={setCryptoType}
                setSelectedTokenIcon={setSelectedTokenIcon}
                setChainStatus={setChainStatus}
                chainStatus={chainStatus}
              />
              <TokenBalanceField
                cryptoType={cryptoType}
                points={points}
                tokenBalance={tokenBalance}
                currentPrice={currentPrice}
                nextPrice={nextPrice}
                walletAddress={walletAddress}
              />
              <DurationField timerValue={timerValue} />
              <RaisedField raisedValue={raiseValue} />
              <Referral />
            </Box>
            <ValueTypeField
              selectedTokenIcon={selectedTokenIcon}
              tokenBalance={tokenBalance}
              buyValue={buyValue}
              setBuyValue={setBuyValue}
              pointsValue={pointsValue}
              setPointsValue={setPointsValue}
              currentChainId={currentChainId}
            />

            <Box mt={4} width={"100%"}>
              <CustomButton
                title={!currentUser.address ? "CONNECT WALLET" : "BUY NOW"}
                styles={styles}
                handleClick={
                  !currentUser.address
                    ? handleOpenModalClick
                    : handleBuyNowClick
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
