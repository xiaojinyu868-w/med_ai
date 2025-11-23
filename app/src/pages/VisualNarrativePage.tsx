import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StimulusViewer } from '../components/StimulusViewer';
import { MediaRecorderContainer } from '../components/MediaRecorderContainer';
import { useAppDispatch, useAppSelector } from '../store';
import {
  clearError,
  fetchNarrativeMaterials,
  setPermissionGranted,
  setStatus,
  uploadNarrative,
} from '../store/narrativeSlice';
import { useMediaRecorder } from '../hooks/useMediaRecorder';

export const VisualNarrativePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { materials, status, error } = useAppSelector((s) => s.narrative);
  const { permissionState, recordingState, stream, startRecording, stopRecording, reset } = useMediaRecorder();
  const [deviceMissing, setDeviceMissing] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [lastDuration, setLastDuration] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchNarrativeMaterials());
  }, [dispatch]);

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some((d) => d.kind === 'videoinput');
        setDeviceMissing(!hasCamera);
      } catch {
        setDeviceMissing(false);
      }
    };
    checkDevices();
  }, []);

  const material = useMemo(() => materials[0], [materials]);

  const handleStart = useCallback(async () => {
    if (deviceMissing && !import.meta.env.DEV) {
      setToast('未检测到摄像头，无法进行本环节');
      return;
    }
    dispatch(clearError());
    dispatch(setStatus('recording'));
    try {
      await startRecording();
      dispatch(setPermissionGranted(true));
    } catch (err) {
      dispatch(setStatus('idle'));
      if (permissionState === 'denied') {
        setToast('需开启摄像头/麦克风权限');
      } else if (err instanceof Error) {
        setToast(err.message);
      }
    }
  }, [deviceMissing, dispatch, permissionState, startRecording]);

  const uploadBlob = useCallback(
    async (blob: Blob, duration: number) => {
      dispatch(setStatus('uploading'));
      try {
        await dispatch(
          uploadNarrative({
            file: blob,
            duration,
            sessionId: localStorage.getItem('sessionId') ?? 'sess_local',
          }),
        ).unwrap();
        setToast('上传成功，进入诊疗对话');
        navigate('/diagnosis');
      } catch (err) {
        const message = err instanceof Error ? err.message : '上传失败';
        setToast(message);
        dispatch(setStatus('error'));
      }
    },
    [dispatch, navigate],
  );

  const handleStop = useCallback(async () => {
    const result = await stopRecording();
    if (!result) return;
    const seconds = result.duration / 1000;
    setLastDuration(seconds);
    if (seconds < 5) {
      setToast('请再多描述一点细节（至少 5 秒）');
      reset();
      dispatch(setStatus('idle'));
      return;
    }
    setRecordedBlob(result.blob);
    uploadBlob(result.blob, result.duration);
  }, [dispatch, reset, stopRecording, uploadBlob]);

  useEffect(() => {
    let timer: number | undefined;
    if (recordingState === 'recording') {
      const startedAt = performance.now();
      timer = window.setInterval(() => {
        const elapsed = (performance.now() - startedAt) / 1000;
        setDurationSeconds(elapsed);
        if (elapsed >= 180) {
          handleStop();
        }
      }, 500);
    } else {
      setDurationSeconds(0);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [handleStop, recordingState]);

  const handleRetryUpload = useCallback(async () => {
    if (recordedBlob) {
      uploadBlob(recordedBlob, lastDuration * 1000);
    }
  }, [lastDuration, recordedBlob, uploadBlob]);

  if (permissionState === 'denied') {
    return (
      <Alert severity="error" action={<Button onClick={handleStart}>已开启，重试</Button>}>
        本环节需要摄像头/麦克风权限，请在浏览器地址栏开启后点击重试。
      </Alert>
    );
  }

  if (deviceMissing && !import.meta.env.DEV) {
    return (
      <Alert severity="warning">
        未检测到摄像头，无法进行本环节。
        {import.meta.env.DEV && (
          <Button size="small" onClick={() => setDeviceMissing(false)} sx={{ ml: 1 }}>
            开发模式跳过
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box flex={1}>
          <Typography variant="h6" gutterBottom>
            看图说话
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            请用 1-2 分钟描述你在图片中看到的内容以及联想。
          </Typography>
          <StimulusViewer material={material} />
        </Box>
        <Box flex={1}>
          <MediaRecorderContainer
            stream={stream}
            recordingState={recordingState}
            durationSeconds={durationSeconds}
            uploadStatus={status}
            onStart={handleStart}
            onStop={handleStop}
            onRetryUpload={handleRetryUpload}
          />
        </Box>
      </Stack>
      {status === 'uploading' && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            上传中，请稍候...
          </Typography>
        </Stack>
      )}
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast(null)} message={toast ?? ''} />
    </Stack>
  );
};
