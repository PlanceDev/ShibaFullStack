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
import { toast } from "react-toastify";

const styles = { width: "100%" };

export const Cryptocurrency = () => {
  const { pricingRounds, setPricingRounds } = useContext(Context);

  const {
    setOpenModal,
    setCurrentChainId,
    currentChainId,
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
        toast.error("Chain not set.");
        // await setChainId();
        return;
      }

      if (!buyValue || buyValue <= 0) {
        console.log("Amount value must be greater than 0.");
        toast.error("Amount value must be greater than 0.");
        return;
      }

      if (buyValue > currentUser.balance) {
        console.log("Insufficient balance.");
        toast.error("Insufficient balance.");
        return;
      }

      let value = ethers.utils.parseUnits(
        Number(buyValue).toString(),
        currentChain.decimals
      );

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let nativeTokens = ["s_Raiser", "a_Raiser", "b_Raiser"];

      const contract = new ethers.Contract(
        currentChain.contract,
        mainContractAbi,
        provider.getSigner()
      );

      //  Request approval for non-native tokens
      if (!nativeTokens.includes(currentChain.tokenSymbol)) {
        const tokenContract = new ethers.Contract(
          currentChain.tokenContract,
          currentChain.tokenAbi,
          provider.getSigner()
        );

        // Check if the user has approved the contract to spend their tokens
        const tokenAllowance = await tokenContract.allowance(
          currentUser.address,
          currentChain.contract
        );

        // If the user has not approved the contract to spend their tokens, request approval
        if (Number(tokenAllowance.toString()) <= value) {
          await tokenContract.approve(currentChain.contract, value);
        }

        // Send the contribution transaction with ERC tokens
        const contributionResult = await contract.contribute(
          currentChain.tokenContract,
          value,
          referralCode.replace("-", ""),
          {
            from: currentUser.address,
            gasLimit: 500000,
          }
        );

        sendDataToServer(contributionResult);
      } else {
        // Send the contribution transaction with native tokens
        const contributionResult = await contract.contribute(
          currentChain.tokenContract,
          0,
          referralCode.replace("-", ""),
          {
            from: currentUser.address,
            value,
          }
        );

        sendDataToServer(contributionResult);
      }
    } catch (err) {
      console.log(err);
      toast.error("User rejected the transaction.");
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

            {pricingRounds < 1 && (
              <Box mt={4} width={"100%"}>
                <CustomButton
                  title={
                    !currentUser.address
                      ? "CONNECT WALLET"
                      : "Sale Has Not Started"
                  }
                  styles={styles}
                  handleClick={
                    !currentUser.address ? handleOpenModalClick : () => {}
                  }
                />
              </Box>
            )}

            {pricingRounds <= 30 && pricingRounds >= 1 && (
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
            )}

            {pricingRounds > 30 && (
              <Box mt={4} width={"100%"}>
                <CustomButton
                  title={
                    !currentUser.address ? "CONNECT WALLET" : "Sale Not Active"
                  }
                  styles={styles}
                  handleClick={
                    !currentUser.address ? handleOpenModalClick : () => {}
                  }
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
