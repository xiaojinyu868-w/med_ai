import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProgressHeader } from "../components/ProgressHeader";
import { QuestionCard } from "../components/QuestionCard";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchScale,
  recordDwellTime,
  setAnswer,
  setCurrentIndex,
  submitScale,
} from "../store/scaleSlice";

export const ScalePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    questions = [],
    status = "idle",
    currentIndex = 0,
    answers = {},
    dwellTimes = [],
    result,
  } = useAppSelector((s) => s.scale) ?? {};
  const { user } = useAppSelector((s) => s.auth);
  const [errorOpen, setErrorOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    ageRange: "",
    history: "",
    diagnosisTime: "",
    diagnosisId: "",
    note: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchScale())
        .unwrap()
        .catch(() => setErrorOpen(true));
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const question = questions.length > 0 ? questions[currentIndex] : undefined;
  const isLast =
    questions.length > 0 ? currentIndex === questions.length - 1 : false;

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
      await dispatch(submitScale({ answers, dwellTimes, profile })).unwrap();
      setSubmitted(true);
    } catch {
      setErrorOpen(true);
    }
  };

  const handleRecordDwell = (dwell: number, value?: string | null) => {
    if (!question || !value) return;
    dispatch(
      recordDwellTime({ questionId: question.id, value, dwellTimeMs: dwell }),
    );
  };

  if ((status === "loading" || status === "idle") && !questions.length) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>
          正在加载量表...
        </Typography>
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box textAlign="center" mt={6}>
        <Typography color="error">加载失败，请刷新</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => dispatch(fetchScale())}
        >
          刷新
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          个人信息（用于结果解读）
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="姓名"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="性别"
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="年龄段"
              placeholder="如 18-22"
              value={profile.ageRange}
              onChange={(e) =>
                setProfile({ ...profile, ageRange: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="是否有抑郁病史"
              value={profile.history}
              onChange={(e) =>
                setProfile({ ...profile, history: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="确诊时间"
              value={profile.diagnosisTime}
              onChange={(e) =>
                setProfile({ ...profile, diagnosisTime: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="确诊编号"
              value={profile.diagnosisId}
              onChange={(e) =>
                setProfile({ ...profile, diagnosisId: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              label="备注（可选）"
              value={profile.note}
              onChange={(e) => setProfile({ ...profile, note: e.target.value })}
            />
          </Grid>
        </Grid>
      </Paper>
      {questions.length > 0 && question && (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            指导语：请您阅读下面的情绪描述，填写自己在多大程度上感受到了这种情绪。0：完全不；1：好几天；2：超过一周；3：几乎每天
          </Alert>
          <ProgressHeader current={currentIndex} total={questions.length} />
          <QuestionCard
            key={question.id}
            question={question}
            selected={answers[question.id]}
            onSelect={handleSelect}
            onPrev={
              currentIndex > 0
                ? () => dispatch(setCurrentIndex(currentIndex - 1))
                : undefined
            }
            isLast={isLast}
            onSubmitLast={handleSubmit}
            onRecordDwell={handleRecordDwell}
          />
        </>
      )}
      {submitted && result && (
        <Paper sx={{ p: 2, mt: 3 }} variant="outlined">
          <Typography variant="subtitle1" gutterBottom>
            评估结果
          </Typography>
          <Typography>
            总分：{result.score ?? "--"}，严重程度：
            {result.severity ?? "未计算"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {result.summaryText ?? "请联系校心理老师获取进一步支持。"}
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => navigate("/visual-narrative")}
          >
            继续下一步（看图描述）
          </Button>
        </Paper>
      )}
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
        message="请求失败，请重试"
      />
    </Box>
  );
};
