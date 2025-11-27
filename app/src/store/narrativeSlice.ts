import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../lib/axios";
import type { NarrativeMaterial, PictureText } from "../types";

type NarrativeState = {
  status: "idle" | "loading" | "submitting" | "succeeded" | "failed";
  materials: NarrativeMaterial[];
  selected: NarrativeMaterial[];
  responses: PictureText[];
  currentIndex: number;
  error?: string;
  offlineSaved?: boolean;
};

const initialState: NarrativeState = {
  status: "idle",
  materials: [],
  selected: [],
  responses: [],
  currentIndex: 0,
};

export const fetchNarrativeMaterials = createAsyncThunk(
  "narrative/materials",
  async () => {
    const res = await api.get<{ materials: NarrativeMaterial[] }>("/pictures");
    return res.data.materials;
  },
);

export const submitNarrativeText = createAsyncThunk(
  "narrative/submitText",
  async (payload: PictureText[], { rejectWithValue }) => {
    try {
      const res = await api.post<{ success: boolean }>("/pictures/text", {
        responses: payload,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const pickOnePerCategory = (materials: NarrativeMaterial[]) => {
  const categories: Record<
    "negative" | "neutral" | "positive",
    NarrativeMaterial[]
  > = {
    negative: [],
    neutral: [],
    positive: [],
  };
  materials.forEach((m) => {
    categories[m.category]?.push(m);
  });
  return (["negative", "neutral", "positive"] as const)
    .map((cat) => {
      const list = categories[cat];
      if (!list.length) return undefined;
      return list[Math.floor(Math.random() * list.length)];
    })
    .filter(Boolean) as NarrativeMaterial[];
};

const narrativeSlice = createSlice({
  name: "narrative",
  initialState,
  reducers: {
    setResponses: (state, action: PayloadAction<PictureText[]>) => {
      state.responses = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    resetNarrative: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNarrativeMaterials.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNarrativeMaterials.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.materials = action.payload;
        state.selected = pickOnePerCategory(action.payload);
        state.currentIndex = 0;
        state.responses = [];
      })
      .addCase(fetchNarrativeMaterials.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(submitNarrativeText.pending, (state) => {
        state.status = "submitting";
        state.offlineSaved = false;
      })
      .addCase(submitNarrativeText.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(submitNarrativeText.rejected, (state) => {
        state.status = "failed";
        state.offlineSaved = true;
      });
  },
});

export const { setResponses, setCurrentIndex, resetNarrative } =
  narrativeSlice.actions;
export default narrativeSlice.reducer;
