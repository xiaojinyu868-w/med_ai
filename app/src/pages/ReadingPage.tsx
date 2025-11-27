import { useEffect, useState } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchReadings,
  markCompleted,
  recordReadings,
} from "../store/readingSlice";

export const ReadingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, status, completedIds, error } = useAppSelector(
    (s) => s.reading,
  );
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!selected.length) {
      dispatch(fetchReadings());
    }
  }, [dispatch, selected.length]);

  const current = selected[currentIdx];

  const handleComplete = async () => {
    if (!current) return;
    dispatch(markCompleted(current.id));
    if (currentIdx < selected.length - 1) {
      setCurrentIdx(currentIdx + 1);
      return;
    }
    try {
      await dispatch(recordReadings(completedIds.concat(current.id))).unwrap();
    } catch {
      // ignore, offline fallback
    }
    navigate("/interview");
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">阅读短文（随机 2 篇）</Typography>
      <Alert severity="info">
        引导：系统会从 6 篇候选中随机抽取 2
        篇。请认真阅读当前短文，阅读完点击“已读完，继续”进入下一篇。
      </Alert>
      {current ? (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {current.title}
          </Typography>
          <Box whiteSpace="pre-wrap" color="text.secondary">
            {current.content}
          </Box>
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Button variant="contained" onClick={handleComplete}>
              已读完，继续
            </Button>
          </Stack>
        </Paper>
      ) : status === "loading" ? (
        <Typography>加载短文...</Typography>
      ) : (
        <Alert severity="error">未能加载短文</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
};
