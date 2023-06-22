import React, { useContext, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
import Web3 from "web3";
import { InputField } from "../../../components/InputField";
import { Context } from "../../../context/AppContext";

import shibartIcon from "../../../assets/images/home/shibartIcon.png";

import { useSelector, useDispatch } from "react-redux";
import { setPurchaseValue } from "../../../store/PurchaseValue";
import { mainContractAbi } from "../../../constant/mainContractAbi";

export const ValueTypeField = ({
  selectedTokenIcon,
  tokenBalance,
  buyValue,
  setBuyValue,
  pointsValue,
  setPointsValue,
  currentChainId,
}) => {
  let provider;

  const currentChain = useSelector((state) => state.chain);
  const currentUser = useSelector((state) => state.user);
  const purchaseValue = useSelector((state) => state.purchaseValue);
  const dispatch = useDispatch();

  const handleBuyChange = async (e) => {
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

    setBuyValue(e.target.value);

    if (e.target.value !== "") {
      let value = window.web3.utils.toWei(e.target.value.toString(), "ether");

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
    }
  };

  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

  useEffect(() => {
    setBuyValue(0);
    setPointsValue(0);
  }, [currentChainId, setBuyValue, setPointsValue]);

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
