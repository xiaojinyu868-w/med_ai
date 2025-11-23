import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Snackbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProgressHeader } from '../components/ProgressHeader';
import { QuestionCard } from '../components/QuestionCard';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchScale, recordDwellTime, setAnswer, setCurrentIndex, submitScale } from '../store/scaleSlice';

export const ScalePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { questions = [], status = 'idle', currentIndex = 0, answers = {}, dwellTimes = [] } =
    useAppSelector((s) => s.scale) ?? {};
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchScale()).unwrap().catch(() => setErrorOpen(true));
    }
  }, [dispatch, status]);

  const question = questions.length > 0 ? questions[currentIndex] : undefined;
  const isLast = questions.length > 0 ? currentIndex === questions.length - 1 : false;

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        dispatch(setCurrentIndex(currentIndex + 1));
      }, 300);
    }
  };

  const handleSelect = (value: string) => {
    if (!question) return;
    dispatch(setAnswer({ id: question.id, value }));
    if (!isLast) {
      goNext();
    }
  };

  const handleSubmit = async () => {
    if (!question) return;
    try {
      await dispatch(submitScale({ answers, dwellTimes })).unwrap();
      navigate('/visual-narrative');
    } catch {
      setErrorOpen(true);
    }
  };

  const handleRecordDwell = (dwell: number, value?: string | null) => {
    if (!question || !value) return;
    dispatch(recordDwellTime({ questionId: question.id, value, dwellTimeMs: dwell }));
  };

  if ((status === 'loading' || status === 'idle') && !questions.length) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>
          正在加载量表...
        </Typography>
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box textAlign="center" mt={6}>
        <Typography color="error">加载失败，请刷新</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => dispatch(fetchScale())}>
          刷新
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {questions.length > 0 && question && (
        <>
          <ProgressHeader current={currentIndex} total={questions.length} />
          <QuestionCard
            key={question.id}
            question={question}
            selected={answers[question.id]}
            onSelect={handleSelect}
            onPrev={currentIndex > 0 ? () => dispatch(setCurrentIndex(currentIndex - 1)) : undefined}
            isLast={isLast}
            onSubmitLast={handleSubmit}
            onRecordDwell={handleRecordDwell}
          />
        </>
      )}
      <Snackbar open={errorOpen} autoHideDuration={3000} onClose={() => setErrorOpen(false)} message="请求失败，请重试" />
    </Box>
  );
};
