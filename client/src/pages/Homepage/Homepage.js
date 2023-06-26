import { useWeb3React } from "@web3-react/core";
import { useEffect, useContext, useState } from "react";
import { Box } from "@mui/material";
import Web3 from "web3";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/User";
import { setCurrentChain } from "../../store/Chain";
import {
  Cryptocurrency,
  ShibartGenerate,
  Gallery,
  Roadmap,
  TokenAirdrop,
} from "../Homepage";
import { mainContractAbi } from "../../constant/mainContractAbi";
import { Context } from "../../context/AppContext";
import { parsedAbi } from "../../constant/parsedAbi";
import {
  getPrice,
  getNextPrice,
  getTimeStamp,
  getRaised,
  getPoints,
  getBalance,
  getDecimals,
} from "./utils";

let provider;

export const Homepage = () => {
  const location = useLocation();
  const { active, account } = useWeb3React();
  const { setTimerValue, setReferralCode, pricingRounds, setPricingRounds } =
    useContext(Context);

  const currentUser = useSelector((state) => state.user);
  const currentChain = useSelector((state) => state.chain);
  const dispatch = useDispatch();

  const [ethTimeStamp, setEthTimeStamp] = useState(0);

  // Set referral code from url if it exists
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get("referral");

    if (!paramValue) return;

    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/referral/${paramValue}`, {
        withCredentials: true,
      })
      .then((res) => {
        setReferralCode(paramValue);
      });
  }, []);

  // Fetch current chain and set provider
  useEffect(() => {
    provider = new ethers.providers.Web3Provider(
      new Web3.providers.HttpProvider(currentChain.rpcUrl)
    );
  }, [currentChain]);

  // Fetch data from contract and set redux state
  const setParams = () => {
    try {
      getTimeStamp(currentChain.contract, provider, setEthTimeStamp);
      getPrice(currentChain.contract, provider, dispatch, setCurrentChain);
      getNextPrice(currentChain.contract, provider, dispatch, setCurrentChain);
      getRaised(currentChain.contract, provider, dispatch, setCurrentChain);
      getDecimals(currentChain, provider, dispatch, setCurrentChain);

      if (active) {
        getBalance(
          currentChain,
          provider,
          dispatch,
          setCurrentUser,
          setCurrentChain
        );

        getPoints(
          currentChain.contract,
          provider,
          dispatch,
          currentUser,
          setCurrentUser
        );
      }
    } catch (err) {
      console.log("set params error", err);
    }
  };

  // Fetch timestamp from contract and begin countdown
  useEffect(() => {
    setParams();

    const startCountdown = setInterval(() => {
      if (ethTimeStamp === 0) return;

      let currentTimestamp = new Date().getTime();
      let duration = currentTimestamp / 1000 - ethTimeStamp;
      const rounds =
        Math.floor(duration / process.env.REACT_APP_PERIOD_TIME) + 1;

      //  If sale has started
      if (rounds >= 1) {
        const timeToNextRound = Math.floor(
          process.env.REACT_APP_PERIOD_TIME -
            (duration % process.env.REACT_APP_PERIOD_TIME)
        );

        const days = Math.floor(timeToNextRound / 60 / 60 / 24);
        const hours = Math.floor(timeToNextRound / 60 / 60) % 24;
        const minutes = Math.floor(timeToNextRound / 60) % 60;
        const seconds = timeToNextRound % 60;

        let timerValue = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };

        if (rounds > 30) {
          setPricingRounds(31);
          setTimerValue(timerValue);
          return clearInterval(startCountdown);
        }

        timerValue = {
          days,
          hours,
          minutes,
          seconds,
        };

        setPricingRounds(rounds);
        setTimerValue(timerValue);
      }

      // If sale is in future
      if (rounds < 1) {
        let duration = ethTimeStamp - currentTimestamp / 1000;

        const days = Math.floor(duration / 60 / 60 / 24);
        const hours = Math.floor(duration / 60 / 60) % 24;
        const minutes = Math.floor(duration / 60) % 60;
        const seconds = duration % 60;

        let timerValue = {
          days,
          hours,
          minutes,
          seconds,
        };

        setPricingRounds(0);
        setTimerValue(timerValue);
      }
    }, 1000);

    return () => clearInterval(startCountdown);
  }, [currentChain, account, active, ethTimeStamp, currentUser]);

  // Set web3 on load
  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    }
  }, []);

  return (
    <Box mt={2}>
      <Cryptocurrency />
      <ShibartGenerate />
      <Gallery />
      <Roadmap />
      <TokenAirdrop />
    </Box>
  );
};
