import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import {
  addAnswer,
  fetchInterviewQuestion,
  submitInterviewAnswers,
} from "../store/interviewSlice";

const sequence: Array<"A" | "B" | "C"> = ["A", "B", "C"];

export const InterviewPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { questions, answers, status, error } = useAppSelector(
    (s) => s.interview,
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentCategory = sequence[currentIdx];
  const currentQuestion = questions.find((q) => q.category === currentCategory);
  const currentContent = useMemo(
    () => answers.find((a) => a.category === currentCategory)?.content ?? "",
    [answers, currentCategory],
  );

  useEffect(() => {
    if (!currentQuestion) {
      dispatch(fetchInterviewQuestion(currentCategory));
    }
  }, [currentCategory, currentQuestion, dispatch]);

  const handleNext = async () => {
    if (!currentQuestion) return;
    const updatedAnswers = answers
      .filter((a) => a.category !== currentCategory)
      .concat({
        questionId: currentQuestion.id,
        category: currentQuestion.category,
        content: currentContent,
      });
    dispatch(
      addAnswer({
        questionId: currentQuestion.id,
        category: currentQuestion.category,
        content: currentContent,
      }),
    );
    if (currentIdx < sequence.length - 1) {
      setCurrentIdx(currentIdx + 1);
      return;
    }
    try {
      await dispatch(submitInterviewAnswers(updatedAnswers)).unwrap();
    } catch {
      // offline fallback
    }
    navigate("/report");
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">半结构访谈</Typography>
      <Typography variant="body2" color="text.secondary">
        顺序：中性 → 消极 → 积极。提示：请用 1-3 句话回答以下问题。
      </Typography>
      {currentQuestion ? (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {currentQuestion.content}
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            value={currentContent}
            onChange={(e) =>
              dispatch(
                addAnswer({
                  questionId: currentQuestion.id,
                  category: currentQuestion.category,
                  content: e.target.value,
                }),
              )
            }
            label="你的回答"
            placeholder="请用 1-3 句话作答"
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!currentContent.trim()}
            >
              {currentIdx === sequence.length - 1 ? "提交并生成报告" : "下一题"}
            </Button>
          </Stack>
        </Paper>
      ) : status === "loading" ? (
        <Typography>加载问题...</Typography>
      ) : (
        <Alert severity="error">未能加载问题</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
};
