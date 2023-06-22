import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User";
import chainReducer from "./Chain";
import purchaseValueReducer from "./PurchaseValue";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chain: chainReducer,
    purchaseValue: purchaseValueReducer,
  },
});
