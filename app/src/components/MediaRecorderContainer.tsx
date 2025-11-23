import { useEffect, useRef } from 'react';
import { Box, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';

type Props = {
  stream: MediaStream | null;
  recordingState: 'idle' | 'recording';
  durationSeconds: number;
  uploadStatus?: 'idle' | 'recording' | 'uploading' | 'error' | 'success';
  onStart: () => void;
  onStop: () => void;
  onRetryUpload?: () => void;
};

export const MediaRecorderContainer = ({
  stream,
  recordingState,
  durationSeconds,
  uploadStatus = 'idle',
  onStart,
  onStop,
  onRetryUpload,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const timerLabel = new Date(durationSeconds * 1000).toISOString().substring(14, 19);
  const isUploading = uploadStatus === 'uploading';

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: '#000',
            }}
          >
            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%' }} />
            {recordingState === 'recording' && (
              <Chip
                label={`录制中 ${timerLabel}`}
                color="error"
                size="small"
                sx={{ position: 'absolute', top: 8, left: 8 }}
              />
            )}
          </Box>
          <Stack spacing={1} alignItems="flex-start" sx={{ flex: 1 }}>
            <Typography variant="subtitle1">实时预览</Typography>
            <Typography variant="body2" color="text.secondary">
              请确保面部和声音清晰入镜。录制时长 5s-180s。
            </Typography>
            <Stack direction="row" spacing={2}>
              {recordingState === 'idle' ? (
                <Button variant="contained" onClick={onStart} disabled={isUploading}>
                  开始录制
                </Button>
              ) : (
                <Button variant="contained" color="error" onClick={onStop} disabled={isUploading}>
                  停止并提交
                </Button>
              )}
              {uploadStatus === 'error' && (
                <Button variant="outlined" onClick={onRetryUpload}>
                  重试上传
                </Button>
              )}
            </Stack>
            {isUploading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  上传中...
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
