import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../lib/axios';
import type { ReportData } from '../types';

type ReportState = {
  data?: ReportData;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
};

const initialState: ReportState = {
  status: 'idle',
};

export const fetchReport = createAsyncThunk('report/fetch', async () => {
  const res = await api.get<ReportData>('/report');
  return res.data;
});

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportData: (state, action: PayloadAction<ReportData>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setReportData } = reportSlice.actions;
export default reportSlice.reducer;
