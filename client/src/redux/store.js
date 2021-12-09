import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/accountSlice";
import getWeb3 from "../getWeb3";

export const store = configureStore({
  reducer: {
    accountSlice: accountReducer,
  },
});
