import { mainContractAbi } from "../../constant/mainContractAbi";
import { ethers } from "ethers";
import Web3 from "web3";

// Fetch timestamp from contract
export const getTimeStamp = async (ca, provider, setEthTimeStamp) => {
  try {
    const contract = new ethers.Contract(ca, mainContractAbi, provider);

    let timestamp = await contract.launchAt();
    timestamp = timestamp.toString();

    setEthTimeStamp(timestamp);

    return timestamp;
  } catch (err) {
    console.log("Timestamp error", err);
  }
};

// Fetch current price from contract
export const getPrice = async (ca, provider, dispatch, setCurrentChain) => {
  try {
    const contract = new ethers.Contract(ca, mainContractAbi, provider);

    let price = await contract.currentPrice();
    price = window.web3.utils.fromWei(price.toString(), "ether");

    if (!price) price = 0;

    dispatch(
      setCurrentChain({
        currentPrice: price,
      })
    );

    return price;
  } catch (err) {
    console.log("get price error", err);
  }
};

// Fetch next price from contract
export const getNextPrice = async (ca, provider, dispatch, setCurrentChain) => {
  try {
    const contract = new ethers.Contract(ca, mainContractAbi, provider);

    let nextPrice = await contract.nextPrice();
    nextPrice = window.web3.utils.fromWei(nextPrice.toString(), "ether");

    dispatch(
      setCurrentChain({
        nextPrice,
      })
    );

    return nextPrice;
  } catch (err) {
    console.log("get next price error", err);
  }
};

// Fetch raised amount from contract
export const getRaised = async (ca, provider, dispatch, setCurrentChain) => {
  try {
    // TODO get totals for all chains
    const contract = new ethers.Contract(ca, mainContractAbi, provider);

    let raisedAmount = await contract.raiseLocal();
    raisedAmount = window.web3.utils.fromWei(raisedAmount.toString(), "ether");

    dispatch(
      setCurrentChain({
        raisedAmount,
      })
    );

    return raisedAmount;
  } catch (err) {
    console.log("get raised amount error", err);
  }
};

// Fetch user points from contract
export const getPoints = async (
  ca,
  provider,
  dispatch,
  currentUser,
  setCurrentUser
) => {
  try {
    if (!currentUser.address) return;

    const contract = new ethers.Contract(ca, mainContractAbi, provider);

    let points = await contract.pointsGained(currentUser.address);
    points = points.toString();

    dispatch(
      setCurrentUser({
        points,
      })
    );

    return points;
  } catch (err) {
    console.log("get user points error", err);
  }
};

// Fetch user balance from wallet
export const getBalance = async (
  currentChain,
  provider,
  dispatch,
  currentUser,
  setCurrentUser
) => {
  try {
    let balance;
    let bnbRPC = process.env.REACT_APP_BSC_RPC;
    let arbRPC = process.env.REACT_APP_ARB_RPC;

    const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
    const bnbProvider = new ethers.providers.JsonRpcProvider(bnbRPC);
    const arbProvider = new ethers.providers.JsonRpcProvider(arbRPC);

    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const walletAddress = accounts[0];

    // Get Native balance
    let nativeTokens = ["s_Raiser", "a_Raiser", "b_Raiser"];

    if (nativeTokens.includes(currentChain.tokenSymbol)) {
      if (currentChain.tokenSymbol === "s_Raiser") {
        balance = await ethProvider.getBalance(walletAddress);
      } else if (currentChain.tokenSymbol === "a_Raiser") {
        balance = await arbProvider.getBalance(walletAddress);
      } else if (currentChain.tokenSymbol === "b_Raiser") {
        balance = await bnbProvider.getBalance(walletAddress);
      }

      let balanceValue = window.web3.utils.fromWei(balance.toString(), "ether");

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
    let tokenBalanceValue;

    // Set decimals for USDC, USDT, BTC
    switch (true) {
      case currentChain.tokenSymbol.endsWith("USDC"):
      case currentChain.tokenSymbol.endsWith("USDT"):
        tokenBalanceValue = Number(tokenBalance) / 1e6;
        break;

      case currentChain.tokenSymbol.endsWith("BTC"):
        tokenBalanceValue = Number(tokenBalance) / 1e8;
        break;

      default:
        tokenBalanceValue = window.web3.utils.fromWei(
          tokenBalance.toString(),
          "ether"
        );
        break;
    }

    return dispatch(
      setCurrentUser({
        balance: Number(tokenBalanceValue).toFixed(6),
      })
    );
  } catch (err) {
    console.log("get user balance error", err);
  }
};