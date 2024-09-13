// store/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  createColumnModal: boolean;
  editTextModal: boolean;
  deleteRowModal: boolean;
  createRowModal: boolean;
}

const initialState: ModalState = {
  createColumnModal: false,
  editTextModal: false,
  deleteRowModal: false,
  createRowModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<keyof ModalState>) => {
      state[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof ModalState>) => {
      state[action.payload] = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
