import { useEffect, useContext, useState } from "react";
import { Box } from "@mui/material";
import { NetworkContextName, useWeb3React } from "@web3-react/core";
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

let provider;

// let provider = new ethers.providers.Web3Provider(window.ethereum);

// let provider = new ethers.providers.Web3Provider(
//   new Web3.providers.HttpProvider(
//     "https://data-seed-prebsc-1-s1.binance.org:8545/"
//   )
// );

export const Homepage = () => {
  const location = useLocation();
  const currentUser = useSelector((state) => state.user);
  const currentChain = useSelector((state) => state.chain);
  const dispatch = useDispatch();

  const {
    library,
    active,
    chainId,
    activate,
    account,
    deactivate,
    chainId: currentChainId,
  } = useWeb3React();

  const [ethTimeStamp, setEthTimeStamp] = useState(0);
  const { setTimerValue, setReferralCode, pricingRounds, setPricingRounds } =
    useContext(Context);

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

  // Fetch timestamp from contract
  const getTimeStamp = async (contractAddress) => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        mainContractAbi,
        provider
      );

      return await contract?.launchAt().then((res) => {
        console.log("timestamp", res);
        setEthTimeStamp(res);
      });
    } catch (err) {
      console.log("Timestamp error", err);
    }
  };

  // Fetch current price from contract
  const getPrice = async (contractAddress) => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        mainContractAbi,
        provider
      );

      return await contract?.currentPrice().then((res) => {
        dispatch(
          setCurrentChain({
            currentPrice: window.web3.utils.fromWei(res.toString(), "ether"),
          })
        );
      });
    } catch (err) {
      // console.log("get price error", err);
    }
  };

  // Fetch next price from contract
  const getNextPrice = async (contractAddress) => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        mainContractAbi,
        provider
      );

      return await contract?.nextPrice().then((res) => {
        dispatch(
          setCurrentChain({
            nextPrice: window.web3.utils.fromWei(res.toString(), "ether"),
          })
        );
      });
    } catch (err) {
      // console.log("get next price error", err);
    }
  };

  // Fetch user balance from wallet
  const getUserBalance = async () => {
    try {
      if (!window.web3.eth) return;

      let accounts = await window.web3.eth.getAccounts();

      // Get Native balance
      let nativeTokens = ["s_Raiser", "a_Raiser", "b_Raiser"];

      if (nativeTokens.includes(currentChain.tokenSymbol)) {
        const balance = await window.web3.eth.getBalance(accounts[0]);
        const balanceValue = window.web3.utils.fromWei(balance, "ether");

        // console.log("eth balance", balanceValue);

        return dispatch(
          setCurrentUser({
            balance: Number(balanceValue).toFixed(6),
          })
        );
      }

      // Get ERC-20 Token balance
      const tokenAddress = currentChain.tokenContract;
      const tokenContract = new ethers.Contract(
        tokenAddress,
        currentChain.tokenAbi,
        provider
      );

      const tokenBalance = await tokenContract.balanceOf(accounts[0]);
      const tokenBalanceValue = window.web3.utils.fromWei(
        tokenBalance.toString(),
        "ether"
      );

      return dispatch(
        setCurrentUser({
          balance: Number(tokenBalanceValue).toFixed(6),
        })
      );
    } catch (err) {
      console.log("get user balance error", err);
    }
  };

  // Fetch user points from contract
  const getUserPoints = async (contractAddress) => {
    try {
      if (!currentUser.address) return;

      const contract = new ethers.Contract(
        contractAddress,
        mainContractAbi,
        provider
      );

      return await contract?.pointsGained(currentUser.address).then((res) => {
        const points = res.toString();

        dispatch(
          setCurrentUser({
            points,
          })
        );
      });
    } catch (err) {
      console.log("get user points error", err);
    }
  };

  // Fetch raised amount from contract
  const getRaisedAmount = async (contractAddress) => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        mainContractAbi,
        provider
      );

      return await contract?.raiseLocal().then((res) => {
        const raisedAmount = window.web3.utils.fromWei(res.toString(), "ether");

        // TODO get totals for all chains

        dispatch(
          setCurrentChain({
            raisedAmount,
          })
        );
      });
    } catch (err) {
      console.log("get raised amount error", err);
    }
  };

  // Switch chain on the users wallet
  const setChainId = async () => {
    try {
      if (!active) return;

      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${currentChain.chainNumber.toString(16)}` }],
        })

        .catch((error) => {
          console.error("Error switching chain:", error);
        });

      if (currentChain.network !== "sepolia") {
        await window.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${currentChain.chainNumber.toString(16)}`,
                rpcUrls: [currentChain.rpcUrl],
                chainName: currentChain.name,
                nativeCurrency: {
                  name: currentChain.network,
                  symbol:
                    currentChain.network === "sepolia"
                      ? "SepoliaEth"
                      : currentChain.network === "bsc"
                      ? "tBNB"
                      : currentChain.network === "arbitrum"
                      ? "AGOR"
                      : "ETH",
                  decimals: 18,
                },
              },
            ],
          })
          .catch((error) => {
            console.error("Error setting chain ID:", error);
          });
      }
    } catch (err) {
      console.log("set chain error", err);
    }
  };

  // Fetch timestamp from contract and begin countdown
  useEffect(() => {
    setChainId().then(() => {
      getTimeStamp(currentChain.contract.toString());
      getPrice(currentChain.contract.toString());
      getNextPrice(currentChain.contract.toString());
      getRaisedAmount(currentChain.contract.toString());

      if (active) {
        getUserPoints("0xBeAcC2A8495af6eC8582451F99a5e0Ef50AB0d71");
        getUserBalance();
      }
    });

    const startCountdown = setInterval(() => {
      if (ethTimeStamp === 0) return;

      const currentTimestamp = new Date().getTime();
      const duration = currentTimestamp / 1000 - ethTimeStamp;
      const rounds = Math.floor(duration / 720);
      const timeToNextRound = Math.floor(720 - (duration % 720));

      const days = Math.floor(timeToNextRound / 60 / 60 / 24);
      const hours = Math.floor(timeToNextRound / 60 / 60) % 24;
      const minutes = Math.floor(timeToNextRound / 60) % 60;
      const seconds = timeToNextRound % 60;

      if (rounds > 30) {
        const timerValue = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };

        setTimerValue(timerValue);
        setPricingRounds(30);

        return clearInterval(startCountdown);
      }

      if (rounds > pricingRounds) {
        setPricingRounds(rounds);
      }

      const timerValue = {
        days,
        hours,
        minutes,
        seconds,
      };

      setTimerValue(timerValue);
    }, 1000);

    return () => clearInterval(startCountdown);
  }, [currentChain, account, active, currentUser]);

  // Set web3 on load
  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    }
  }, []);

  // useEffect(() => {
  //   const effect = async () => {
  //     const loadContract = async () => {
  //       const raiserContracts = addressSet.filter(
  //         (item) => item.raiser === true
  //       );

  //       raiserContracts.map(async (item, i) => {
  //         const web3 = new Web3(item.rpcUrl);
  //         const oneRaiserContract = new web3.eth.Contract(
  //           item.abi,
  //           item.testnet
  //         );

  //         await oneRaiserContract?.methods
  //           .raiseLocal()
  //           .call()
  //           .then((res) => {
  //             setRaiseValue(
  //               (rs) =>
  //                 rs +
  //                 Number(window.web3.utils.fromWei(res.toString(), "ether"))
  //             );
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       });
  //     };
  //     loadContract();
  //   };
  //   if (window.web3) {
  //     effect();
  //   }
  // }, [setRaiseValue]);

  // useEffect(() => {
  //   const effect = async () => {
  //     const loadContract = async () => {
  //       if (window.web3) {
  //         const currentContractAddress = addressSet.find(
  //           (item) => item.chainId === currentChainId && item.erc20 === false
  //         );

  //         const currentABI = ABI.find(
  //           (item) => item.chainId === currentChainId && item.erc20 === false
  //         );

  //         if (currentContractAddress && currentABI) {
  //           return await new window.web3.eth.Contract(
  //             currentABI.abi,
  //             currentContractAddress.testnet
  //           );
  //         }
  //       }
  //     };

  //     const loadTokenContract = async () => {
  //       const currentWContractAddress = addressSet.find(
  //         (item) => item.chainId === currentChainId && item.estimate === true
  //       );

  //       if (window.web3 && currentWContractAddress) {
  //         return await new window.web3.eth.Contract(
  //           TokenABI,
  //           currentWContractAddress.testnet
  //         );
  //       }
  //     };

  //     let _contract = await loadContract();
  //     let _tokenContract = await loadTokenContract();

  //     console.log(_contract);

  //     setContract(_contract);
  //     setTokenContract(_tokenContract);
  //   };
  //   effect();
  // }, [
  //   account,
  //   walletAddress,
  //   currentChainId,
  //   setContract,
  //   setTokenContract,
  //   cryptoType,
  //   chainStatus,
  // ]);

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
