import { createSlice } from "@reduxjs/toolkit";
import { chainData } from "../../constant/parsedAbi";

const initialState = {
  name: "Sepolia",
  network: "sepolia",
  cryptoType: "s_Raiser",
  chainId: "0xaa36a7",
  chainNumber: 11155111,
  contract: "0xa504fe0f0af7ee985cede1e72363d644adf40314",
  tokenContract: "0x99e78fbcfa087f72ddc927aa35da148518416959",
  tokenSymbol: "s_Raiser",
  tokenAbi: chainData[0].s_Raiser,
  currentPrice: 0,
  nextPrice: 0,
  rpcUrl: "https://rpc2.sepolia.org",
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
    },
  },
});

export const { setCurrentChain } = chainSlice.actions;

export default chainSlice.reducer;
