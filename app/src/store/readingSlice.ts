import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ReadingPassage } from "../types";

type ReadingState = {
  pool: ReadingPassage[];
  selected: ReadingPassage[];
  status: "idle" | "loading" | "succeeded" | "failed";
  completedIds: number[];
  error?: string;
};

const initialState: ReadingState = {
  pool: [],
  selected: [],
  status: "idle",
  completedIds: [],
};

export const fetchReadings = createAsyncThunk("reading/fetch", async () => {
  const res = await api.get<{ pool: ReadingPassage[] }>("/readings");
  return res.data.pool;
});

export const recordReadings = createAsyncThunk(
  "reading/record",
  async (passageIds: number[]) => {
    const res = await api.post("/readings/record", { passageIds });
    return res.data;
  },
);

const pickTwo = (pool: ReadingPassage[]) => {
  if (pool.length <= 2) return pool;
  const cloned = [...pool];
  const chosen: ReadingPassage[] = [];
  while (chosen.length < 2 && cloned.length) {
    const idx = Math.floor(Math.random() * cloned.length);
    chosen.push(cloned[idx]);
    cloned.splice(idx, 1);
  }
  return chosen;
};

const readingSlice = createSlice({
  name: "reading",
  initialState,
  reducers: {
    markCompleted: (state, action: PayloadAction<number>) => {
      if (!state.completedIds.includes(action.payload)) {
        state.completedIds.push(action.payload);
      }
    },
    resetReadings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReadings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReadings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pool = action.payload;
        state.selected = pickTwo(action.payload);
        state.completedIds = [];
      })
      .addCase(fetchReadings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(recordReadings.fulfilled, (state) => {
        state.status = "succeeded";
      });
  },
});

export const { markCompleted, resetReadings } = readingSlice.actions;
export default readingSlice.reducer;
