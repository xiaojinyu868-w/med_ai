import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

type Props = {
  data: { dimension: string; value: number }[];
};

export const DimensionRadar = ({ data }: Props) => {
  return (
    <Box sx={{ height: 320 }}>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="score"
            dataKey="value"
            stroke="#2b7cff"
            fill="#2b7cff"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mt={1}
      >
        多维指标雷达图
      </Typography>
    </Box>
  );
};
