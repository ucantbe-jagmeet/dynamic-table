import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./tableSlice";
import modalReducer from "./modalSlice";

export const store = configureStore({
  reducer: {
    table: tableReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
