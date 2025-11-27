import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/axios";
import type { InterviewAnswer, InterviewQuestion } from "../types";

type InterviewState = {
  status: "idle" | "loading" | "failed" | "succeeded" | "submitting";
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  error?: string;
};

const initialState: InterviewState = {
  status: "idle",
  questions: [],
  answers: [],
};

export const fetchInterviewQuestion = createAsyncThunk(
  "interview/fetchQuestion",
  async (category: "A" | "B" | "C") => {
    const res = await api.get<{ questions: InterviewQuestion[] }>(
      `/interview/questions?category=${category}&count=1`,
    );
    return res.data.questions[0];
  },
);

export const submitInterviewAnswers = createAsyncThunk(
  "interview/submitAnswers",
  async (payload: InterviewAnswer[]) => {
    const res = await api.post("/interview/answers", { answers: payload });
    return res.data;
  },
);

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    addAnswer: (state, action) => {
      state.answers = state.answers.filter(
        (a) => a.category !== action.payload.category,
      );
      state.answers.push(action.payload);
    },
    resetInterview: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviewQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInterviewQuestion.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.questions = state.questions.filter(
            (q) => q.category !== action.payload.category,
          );
          state.questions.push(action.payload);
        }
      })
      .addCase(fetchInterviewQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(submitInterviewAnswers.pending, (state) => {
        state.status = "submitting";
      })
      .addCase(submitInterviewAnswers.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(submitInterviewAnswers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addAnswer, resetInterview } = interviewSlice.actions;
export default interviewSlice.reducer;
