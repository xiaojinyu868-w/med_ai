import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";

type Props = {
  score: number;
};

const getColor = (score: number) => {
  if (score < 5) return "#2ec49c";
  if (score < 10) return "#f5c542";
  return "#f35b5b";
};

export const GaugeChart = ({ score }: Props) => {
  const data = [
    { name: "score", value: Math.min(score, 21) },
    { name: "rest", value: Math.max(0, 21 - score) },
  ];
  const color = getColor(score);

  return (
    <Box sx={{ position: "relative", height: 240 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={100}
            stroke="none"
          >
            <Cell key="score" fill={color} />
            <Cell key="rest" fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box textAlign="center">
          <Typography variant="h4" fontWeight={700}>
            {score}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            GAD-7 焦虑指数
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
