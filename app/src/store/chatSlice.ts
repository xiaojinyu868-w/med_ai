import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../lib/axios';
import type { ChatMessage } from '../types';
import type { RootState } from './index';

type ChatState = {
  messages: ChatMessage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  inputMetrics: {
    editCount: number;
  };
  error?: string;
};

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  inputMetrics: { editCount: 0 },
};

export const fetchChatIntro = createAsyncThunk('chat/intro', async () => {
  const res = await api.post<{ messages: ChatMessage[] }>('/chat', {
    messages: [{ id: nanoid(), role: 'system', type: 'text', content: '欢迎对话' }],
  });
  return res.data.messages;
});

export const sendChatMessage = createAsyncThunk(
  'chat/send',
  async (
    payload: { content: string; editCount: number },
    { getState },
  ) => {
    const state = getState() as RootState;
    const outgoing: ChatMessage = {
      id: nanoid(),
      role: 'user',
      type: 'text',
      content: payload.content,
    };
    const res = await api.post<{ messages: ChatMessage[] }>('/chat', {
      messages: [...state.chat.messages, outgoing],
      editCount: payload.editCount,
      sessionId: localStorage.getItem('sessionId'),
    });
    return { response: res.data.messages, outgoing };
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    incrementEditCount: (state) => {
      state.inputMetrics.editCount += 1;
    },
    resetEditCount: (state) => {
      state.inputMetrics.editCount = 0;
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    disableOptions: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.map((msg) =>
        msg.id === action.payload && msg.role === 'ai' && msg.type === 'options'
          ? { ...msg, disabled: true }
          : msg,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatIntro.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatIntro.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchChatIntro.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload.outgoing, ...action.payload.response);
        state.inputMetrics.editCount = 0;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { incrementEditCount, resetEditCount, setMessages, disableOptions } = chatSlice.actions;
export default chatSlice.reducer;
