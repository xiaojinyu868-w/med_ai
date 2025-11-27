import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../lib/axios";
import type { DwellTime, Question } from "../types";

type ScaleState = {
  questions: Question[];
  status: "idle" | "loading" | "succeeded" | "failed";
  answers: Record<string, string>;
  dwellTimes: DwellTime[];
  currentIndex: number;
  profile?: Record<string, string>;
  result?: { score?: number; severity?: string; summaryText?: string };
  error?: string;
};

const initialState: ScaleState = {
  questions: [],
  status: "idle",
  answers: {},
  dwellTimes: [],
  currentIndex: 0,
};

export const fetchScale = createAsyncThunk("scale/fetch", async () => {
  const res = await api.get<{ questions: Question[] }>("/scale");
  return res.data.questions;
});

export const submitScale = createAsyncThunk(
  "scale/submit",
  async (payload: {
    answers: Record<string, string>;
    dwellTimes: DwellTime[];
    profile?: Record<string, string>;
  }) => {
    const res = await api.post("/scale", payload);
    return res.data;
  },
);

const scaleSlice = createSlice({
  name: "scale",
  initialState,
  reducers: {
    setAnswer: (
      state,
      action: PayloadAction<{ id: string; value: string }>,
    ) => {
      state.answers[action.payload.id] = action.payload.value;
    },
    recordDwellTime: (state, action: PayloadAction<DwellTime>) => {
      state.dwellTimes = state.dwellTimes.filter(
        (d) => d.questionId !== action.payload.questionId,
      );
      state.dwellTimes.push(action.payload);
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    resetScale: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScale.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchScale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.questions = action.payload;
        state.currentIndex = 0;
        state.answers = {};
        state.dwellTimes = [];
      })
      .addCase(fetchScale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(submitScale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitScale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.result = {
          score: action.payload?.score,
          severity: action.payload?.severity,
          summaryText:
            action.payload?.summaryText ??
            "从近期回答看，情绪低落频率较高，建议尽快与校心理老师沟通。",
        };
      })
      .addCase(submitScale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setAnswer, recordDwellTime, setCurrentIndex, resetScale } =
  scaleSlice.actions;
export default scaleSlice.reducer;
