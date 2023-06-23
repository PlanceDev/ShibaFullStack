import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
import Web3 from "web3";
import { InputField } from "../../../components/InputField";

import shibartIcon from "../../../assets/images/home/shibartIcon.png";

import { useSelector, useDispatch } from "react-redux";
import { setPurchaseValue } from "../../../store/PurchaseValue";
import { mainContractAbi } from "../../../constant/mainContractAbi";
import { cryptoTypes } from "../../../config/wallet_config";

export const ValueTypeField = ({
  buyValue,
  setBuyValue,
  setPointsValue,
  currentChainId,
}) => {
  let provider;

  const currentChain = useSelector((state) => state.chain);
  const currentUser = useSelector((state) => state.user);
  const purchaseValue = useSelector((state) => state.purchaseValue);
  const dispatch = useDispatch();
  const [selectedTokenIcon, setSelectedTokenIcon] = useState("");

  const updatePoints = async (value) => {
    if (!provider) {
      provider = new ethers.providers.Web3Provider(
        new Web3.providers.HttpProvider(currentChain.rpcUrl)
      );
    }

    const contract = new ethers.Contract(
      currentChain.contract,
      mainContractAbi,
      provider
    );

    // Get equivalent points from contract
    await contract
      .estimate(currentChain.tokenContract, value)
      .then((res) => {
        dispatch(
          setPurchaseValue({
            pointsValue: Number(res.toString()),
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // When a user types in the buy field
  const handleBuyChange = async (e) => {
    setBuyValue(e.target.value);

    if (isNaN(e.target.value)) {
      return;
    }

    if (e.target.value !== "") {
      let value;

      if (
        currentChain.tokenSymbol.endsWith("USDC") ||
        currentChain.tokenSymbol.endsWith("USDT")
      ) {
        value = ethers.utils.parseUnits(e.target.value.toString(), 6);
      } else if (currentChain.tokenSymbol.endsWith("BTC")) {
        value = ethers.utils.parseUnits(e.target.value.toString(), 8);
      } else {
        value = window.web3.utils.toWei(e.target.value.toString(), "ether");
      }

      updatePoints(value);
    }
  };

  // When a user types in the points field
  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

  useEffect(() => {
    setBuyValue(0);
    setPointsValue(0);
  }, [currentChainId, setBuyValue, setPointsValue]);

  // change token image & points received on token change
  useEffect(() => {
    const tokenImage = cryptoTypes.filter(
      (item) => item.type === currentChain.tokenSymbol
    );

    setSelectedTokenIcon(tokenImage[0].symbol1);

    // Only update points if the user has entered a value in token field
    if (buyValue > 0) {
      let value;

      if (
        currentChain.tokenSymbol.endsWith("USDC") ||
        currentChain.tokenSymbol.endsWith("USDT")
      ) {
        value = ethers.utils.parseUnits(buyValue.toString(), 6);
      } else if (currentChain.tokenSymbol.endsWith("BTC")) {
        value = ethers.utils.parseUnits(buyValue.toString(), 8);
      } else {
        value = window.web3.utils.toWei(buyValue.toString(), "ether");
      }

      updatePoints(value);
    }
  }, [currentChain]);

  return (
    <Grid mt={4} container spacing={4}>
      <Grid item sm={6} xs={12}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            mb={2}
            variant="h5"
            sx={{
              color: "#555555 !important",
              fontSize: 14,
            }}
          >
            You pay
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Max
          </Typography>
        </Box>
        <InputField
          icon={selectedTokenIcon}
          handleChange={handleBuyChange}
          inputValue={buyValue}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Typography
          mb={2}
          variant="h5"
          sx={{
            color: "#555555 !important",
            fontSize: 14,
          }}
        >
          Points you receive
        </Typography>
        <InputField
          icon={shibartIcon}
          handleChange={handlePointsChange}
          inputValue={purchaseValue.pointsValue}
        />
      </Grid>
    </Grid>
  );
};
