import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UIState = {
  loading: boolean;
  toast: string | null;
};

const initialState: UIState = {
  loading: false,
  toast: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    showToast: (state, action: PayloadAction<string>) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const { setLoading, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
