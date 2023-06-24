import { createSlice } from "@reduxjs/toolkit";
import { chainData } from "../../constant/parsedAbi";

const initialState = {
  name: "Sepolia",
  network: "sepolia",
  cryptoType: "s_Raiser",
  chainId: "0xaa36a7",
  chainNumber: 11155111,
  contract: process.env.REACT_APP_ETH_CONTRACT,
  tokenContract: process.env.REACT_APP_WETH_CONTRACT,
  tokenSymbol: "s_Raiser",
  tokenAbi: chainData.filter((obj) => obj.hasOwnProperty("s_WETH"))[0]["abi"],
  currentPrice: 0,
  nextPrice: 0,
  rpcUrl: process.env.REACT_APP_ETH_RPC,
  raisedAmount: 0,
  decimals: 18,
};

const chainSlice = createSlice({
  name: "chain",
  initialState,
  reducers: {
    setCurrentChain: (state, action) => {
      state.name = action.payload.name || state.name;
      state.network = action.payload.network || state.network;
      state.cryptoType = action.payload.cryptoType || state.cryptoType;
      state.chainId = action.payload.chainId || state.chainId;
      state.chainNumber = action.payload.chainNumber || state.chainNumber;
      state.contract = action.payload.contract || state.contract;
      state.tokenContract = action.payload.tokenContract || state.tokenContract;
      state.tokenAbi = action.payload.tokenAbi || state.tokenAbi;
      state.tokenSymbol = action.payload.tokenSymbol || state.tokenSymbol;
      state.currentPrice = action.payload.currentPrice || state.currentPrice;
      state.nextPrice = action.payload.nextPrice || state.nextPrice;
      state.rpcUrl = action.payload.rpcUrl || state.rpcUrl;
      state.raisedAmount = action.payload.raisedAmount || state.raisedAmount;
      state.decimals = action.payload.decimals || state.decimals;
    },
  },
});

export const { setCurrentChain } = chainSlice.actions;

export default chainSlice.reducer;
