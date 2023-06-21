import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: localStorage.getItem("wallet account") || "",
  balance: 0,
  points: 0,
  referralLink: localStorage.getItem("referralLink") || "",
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
  },
});

export const { setCurrentUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
