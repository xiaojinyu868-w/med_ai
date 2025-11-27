import { useMemo } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

const mockData = {
  school: "某高校",
  classStats: [
    { className: "2023-1", total: 50, completed: 40, highRisk: 3 },
    { className: "2023-2", total: 48, completed: 42, highRisk: 2 },
  ],
  severityBuckets: [
    { label: "无症状", value: 30 },
    { label: "轻度", value: 20 },
    { label: "中度", value: 10 },
    { label: "中重度", value: 5 },
    { label: "重度", value: 2 },
  ],
};

export const SchoolDashboardPage = () => {
  const completionRate = useMemo(() => {
    const total = mockData.classStats.reduce((acc, c) => acc + c.total, 0);
    const completed = mockData.classStats.reduce(
      (acc, c) => acc + c.completed,
      0,
    );
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h6">学校端数据总览</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1">完成率</Typography>
        <Typography variant="h4" color="primary" mt={1}>
          {completionRate}%
        </Typography>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          班级完成情况
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>班级</TableCell>
              <TableCell>人数</TableCell>
              <TableCell>已完成</TableCell>
              <TableCell>高风险</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.classStats.map((row) => (
              <TableRow key={row.className}>
                <TableCell>{row.className}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.completed}</TableCell>
                <TableCell>
                  <Chip
                    label={row.highRisk}
                    color={row.highRisk > 0 ? "warning" : "default"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          抑郁严重程度分布
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {mockData.severityBuckets.map((b) => (
            <Chip
              key={b.label}
              label={`${b.label}: ${b.value}`}
              variant="outlined"
            />
          ))}
        </Stack>
      </Paper>
      <Box>
        <Typography variant="body2" color="text.secondary">
          提示：此页为学校端演示，占位后端汇总接口（见
          BACKEND_INTEGRATION.md）。
        </Typography>
      </Box>
    </Stack>
  );
};
