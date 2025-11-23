import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import uiReducer from './uiSlice';
import scaleReducer from './scaleSlice';
import narrativeReducer from './narrativeSlice';
import chatReducer from './chatSlice';
import reportReducer from './reportSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    scale: scaleReducer,
    narrative: narrativeReducer,
    chat: chatReducer,
    report: reportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
