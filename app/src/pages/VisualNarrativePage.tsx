import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StimulusViewer } from "../components/StimulusViewer";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchNarrativeMaterials,
  setCurrentIndex,
  setResponses,
  submitNarrativeText,
} from "../store/narrativeSlice";

export const VisualNarrativePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, status, currentIndex, responses, error, offlineSaved } =
    useAppSelector((s) => s.narrative);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!selected.length) {
      dispatch(fetchNarrativeMaterials());
    }
  }, [dispatch, selected.length]);

  const currentMaterial = useMemo(
    () => selected[currentIndex],
    [currentIndex, selected],
  );
  const currentContent =
    responses.find((r) => r.imageId === currentMaterial?.id)?.content ?? "";

  const handleChange = (val: string) => {
    if (!currentMaterial) return;
    const updated = responses
      .filter((r) => r.imageId !== currentMaterial.id)
      .concat({
        imageId: currentMaterial.id,
        category: currentMaterial.category,
        content: val,
      });
    dispatch(setResponses(updated));
  };

  const handleNext = async () => {
    if (!currentMaterial) return;
    if (currentIndex < selected.length - 1) {
      dispatch(setCurrentIndex(currentIndex + 1));
      return;
    }
    try {
      await dispatch(submitNarrativeText(responses)).unwrap();
      navigate("/reading");
    } catch {
      setToast("已本地保存，网络恢复后自动上传");
      navigate("/reading");
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">看图描述</Typography>
      {currentMaterial ? (
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box flex={1}>
            <StimulusViewer material={currentMaterial} />
            <Typography variant="body2" color="text.secondary" mt={1}>
              类别：
              {currentMaterial.category === "negative"
                ? "负性"
                : currentMaterial.category === "neutral"
                  ? "中性"
                  : "正性"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              提示：请观察当前图片 10-15 秒后，用 1-3
              句文字描述你看到的内容和感受。
            </Typography>
          </Box>
          <Paper sx={{ flex: 1, p: 2 }}>
            <TextField
              multiline
              fullWidth
              minRows={6}
              label="你的描述"
              value={currentContent}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="请用 1-3 句文字描述你看到的内容和感受"
            />
            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!currentContent.trim()}
              >
                {currentIndex === selected.length - 1
                  ? "提交并进入阅读"
                  : "下一张"}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      ) : status === "loading" ? (
        <Typography>加载图片...</Typography>
      ) : (
        <Alert severity="error">未能加载图片素材</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {offlineSaved && (
        <Alert severity="info">已本地保存，网络恢复后自动上传</Alert>
      )}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        message={toast ?? ""}
      />
    </Stack>
  );
};
