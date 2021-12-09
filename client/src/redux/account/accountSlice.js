import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: "",
  isAuthenticated: false,
  web3: null,
};

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
      state.isAuthenticated = true;
    },
    setWeb3: (state, action) => {
      state.web3 = action.payload;
    },
  },
});

export const { setAccount, setWeb3 } = accountSlice.actions;

export const selectAccount = (state) => state.accountSlice.account;
export const selectWeb3 = (state) => state.accountSlice.web3;
export const isAuthenticated = (state) => state.accountSlice.isAuthenticated;

export default accountSlice.reducer;
