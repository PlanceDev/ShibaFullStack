import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  balance: 0,
  points: 0,
  referralLink: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.address = action.payload.address || state.address;
      state.balance = action.payload.balance || state.balance;
      state.points = action.payload.points || state.points;
      state.referralLink = action.payload.referralLink || state.referralLink;
    },

    resetUserState: (state) => {
      state.address = initialState.address;
      state.balance = initialState.balance;
      state.points = initialState.points;
      state.referralLink = initialState.referralLink;
    },
  },
});

export const { setCurrentUser, resetUserState } = userSlice.actions;

export default userSlice.reducer;
