import React, { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import { ethers, BigNumber } from "ethers";
import Web3 from "web3";
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

        const tokenAllowance = await tokenContract.allowance(
          currentUser.address,
          currentChain.contract
        );

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

        // await tokenContract
        //   .allowance(currentUser.address, currentChain.contract)
        //   .then(async (res) => {
        //     if (Number(res.toString()) <= buyValue) {
        //       await tokenContract.approve(currentChain.contract, value);
        //     }

        //     await contract.methods
        //       .contribute(currentChain.tokenContract, value, referralCode)
        //       .send({
        //         from: currentUser.address,
        //         gasLimit: 500000,
        //       })
        //       .then((res) => {
        //         sendDataToServer(res);
        //       })
        //       .catch((err) => {
        //         console.log(err);
        //       });
        //   });
      } else {
        const contributionResult = await contract.methods
          .contribute(currentChain.tokenContract, 0, referralCode)
          .send({
            from: currentUser.address,
            value,
          });

        sendDataToServer(contributionResult);

        // await contract.methods
        //   .contribute(currentChain.tokenContract, 0, referralCode)
        //   .send({
        //     from: currentUser.address,
        //     value,
        //   })
        //   .then((res) => {
        //     sendDataToServer(res);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
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
