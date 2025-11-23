import { useEffect } from 'react';
import { Alert, Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { GaugeChart } from '../components/GaugeChart';
import { DimensionRadar } from '../components/DimensionRadar';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchReport } from '../store/reportSlice';

export const ReportPage = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((s) => s.report);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReport());
    }
  }, [dispatch, status]);

  if (status === 'loading' || !data) {
    return (
      <Box textAlign="center" mt={4}>
        {status === 'loading' ? <CircularProgress /> : <Typography color="text.secondary">加载中...</Typography>}
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h6">综合诊断报告</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box flex={1} bgcolor="#fff" p={2} borderRadius={3} border="1px solid" borderColor="divider">
          <GaugeChart score={data.anxietyScore} />
        </Box>
        <Box flex={1} bgcolor="#fff" p={2} borderRadius={3} border="1px solid" borderColor="divider">
          <DimensionRadar data={data.radar} />
        </Box>
      </Stack>
      {data.authenticityScore < 60 && (
        <Alert severity="warning">
          评估结果可能存在偏差，建议人工复核（真实性 {data.authenticityScore}）
        </Alert>
      )}
      <Box bgcolor="#fff" p={2} borderRadius={3} border="1px solid" borderColor="divider">
        <Typography variant="subtitle1" gutterBottom>
          综合评估建议
        </Typography>
        <Stack spacing={1}>
          {data.insights.map((insight) => (
            <Chip key={insight} label={insight} variant="outlined" sx={{ alignSelf: 'flex-start' }} />
          ))}
        </Stack>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
};
