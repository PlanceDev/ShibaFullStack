import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buyValue: 0,
  pointsValue: 0,
};

const purchaseValueSlice = createSlice({
  name: "purchaseValue",
  initialState,
  reducers: {
    setPurchaseValue: (state, action) => {
      state.buyValue = action.payload.buyValue || state.buyValue;
      state.pointsValue = action.payload.pointsValue || state.pointsValue;
    },
  },
});

export const { setPurchaseValue } = purchaseValueSlice.actions;

export default purchaseValueSlice.reducer;
