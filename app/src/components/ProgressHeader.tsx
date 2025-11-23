import { Box, LinearProgress, Typography } from '@mui/material';

type Props = {
  current: number;
  total: number;
};

export const ProgressHeader = ({ current, total }: Props) => {
  const percent = total === 0 ? 0 : Math.round(((current + 1) / total) * 100);
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        进度：{current + 1}/{total}
      </Typography>
      <LinearProgress variant="determinate" value={percent} />
    </Box>
  );
};
