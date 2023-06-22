import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNative: false,
  network: "sepolia",
  tokenSymbol: "s_USDC",
  chainId: "0xaa36a7",
  chainNumber: 11155111,
  contract: "0xBeAcC2A8495af6eC8582451F99a5e0Ef50AB0d71",
  tokenContract: "0x99e78fbcfa087f72ddc927aa35da148518416959",
  currentPrice: 0,
  nextPrice: 0,
  rpcUrl: "https://sepolia.infura.io/v3/1d62c2d15fee4c2e93097c1c4a09b25c",
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setCurrentToken: (state, action) => {
      state.network = action.payload.network || state.network;
      state.cryptoType = action.payload.cryptoType || state.cryptoType;
      state.chainId = action.payload.chainId || state.chainId;
      state.contract = action.payload.contract || state.contract;
      state.tokenContract = action.payload.tokenContract || state.tokenContract;
      state.tokenSymbol = action.payload.tokenSymbol || state.tokenSymbol;
      state.currentPrice = action.payload.currentPrice || state.currentPrice;
      state.nextPrice = action.payload.nextPrice || state.nextPrice;
    },
  },
});

export const { setCurrentToken } = tokenSlice.actions;

export default tokenSlice.reducer;
