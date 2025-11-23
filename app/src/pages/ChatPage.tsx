import { useEffect, useState } from 'react';
import { Box, Snackbar, Stack, Typography } from '@mui/material';
import { ChatMessageList } from '../components/ChatMessageList';
import { ChatInput } from '../components/ChatInput';
import { useAppDispatch, useAppSelector } from '../store';
import {
  disableOptions,
  fetchChatIntro,
  incrementEditCount,
  resetEditCount,
  sendChatMessage,
} from '../store/chatSlice';

export const ChatPage = () => {
  const dispatch = useAppDispatch();
  const { messages, status, inputMetrics, error } = useAppSelector((s) => s.chat);
  const [input, setInput] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChatIntro());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (error) setToastOpen(true);
  }, [error]);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(sendChatMessage({ content: input.trim(), editCount: inputMetrics.editCount }));
    setInput('');
    dispatch(resetEditCount());
  };

  const handleOptionSelect = (id: string, option: string) => {
    dispatch(disableOptions(id));
    dispatch(sendChatMessage({ content: option, editCount: inputMetrics.editCount }));
    dispatch(resetEditCount());
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">智能诊疗对话</Typography>
      <Box
        sx={{
          minHeight: 400,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          p: 2,
          bgcolor: '#fff',
        }}
      >
        <ChatMessageList messages={messages} onOptionSelect={handleOptionSelect} sending={status === 'loading'} />
      </Box>
      <ChatInput
        value={input}
        disabled={status === 'loading'}
        onChange={(val, cause) => {
          setInput(val);
          if (cause === 'edit') {
            dispatch(incrementEditCount());
          }
        }}
        onKeyAction={() => dispatch(incrementEditCount())}
        onSubmit={handleSend}
      />
      <Snackbar open={toastOpen} autoHideDuration={2000} onClose={() => setToastOpen(false)} message={error ?? ''} />
    </Stack>
  );
};
