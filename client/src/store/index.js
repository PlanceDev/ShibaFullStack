import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User";
import chainReducer from "./Chain";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chain: chainReducer,
  },
});
