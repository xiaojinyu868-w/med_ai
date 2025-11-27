import { Button, Stack, Typography } from "@mui/material";

export const InterventionPage = () => {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: 360 }}
    >
      <Typography variant="h6">AI 心理干预课程正在生成…</Typography>
      <Typography variant="body2" color="text.secondary">
        完成报告后可订阅更新，第一时间获取干预方案。
      </Typography>
      <Button variant="contained" onClick={() => alert("已订阅成功（Mock）")}>
        订阅通知
      </Button>
    </Stack>
  );
};
