import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../lib/axios';
import type { NarrativeMaterial } from '../types';

type NarrativeState = {
  status: 'idle' | 'recording' | 'uploading' | 'success' | 'error';
  permissionGranted: boolean;
  materials: NarrativeMaterial[];
  videoId?: string;
  error?: string;
};

const initialState: NarrativeState = {
  status: 'idle',
  permissionGranted: false,
  materials: [],
};

export const fetchNarrativeMaterials = createAsyncThunk('narrative/materials', async () => {
  const res = await api.get<{ materials: NarrativeMaterial[] }>('/narrative/materials');
  return res.data.materials;
});

export const uploadNarrative = createAsyncThunk(
  'narrative/upload',
  async (payload: { file: Blob; sessionId: string; duration: number }) => {
    const formData = new FormData();
    formData.append('file', payload.file, 'narrative.webm');
    formData.append('sessionId', payload.sessionId);
    formData.append('duration', String(Math.round(payload.duration)));
    const res = await api.post<{ success: boolean; videoId: string }>('/narrative/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.videoId;
  },
);

const narrativeSlice = createSlice({
  name: 'narrative',
  initialState,
  reducers: {
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
    setStatus: (state, action: PayloadAction<NarrativeState['status']>) => {
      state.status = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    resetNarrative: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNarrativeMaterials.fulfilled, (state, action) => {
        state.materials = action.payload;
      })
      .addCase(fetchNarrativeMaterials.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(uploadNarrative.pending, (state) => {
        state.status = 'uploading';
        state.error = undefined;
      })
      .addCase(uploadNarrative.fulfilled, (state, action) => {
        state.status = 'success';
        state.videoId = action.payload;
      })
      .addCase(uploadNarrative.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const { setPermissionGranted, setStatus, clearError, resetNarrative } = narrativeSlice.actions;
export default narrativeSlice.reducer;
