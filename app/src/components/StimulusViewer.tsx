import { Box, Card, CardMedia, Typography } from "@mui/material";
import type { NarrativeMaterial } from "../types";

type Props = {
  material?: NarrativeMaterial;
};

export const StimulusViewer = ({ material }: Props) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      {material ? (
        <>
          <CardMedia
            component="img"
            image={material.imageUrl}
            alt={material.instruction}
          />
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">{material.instruction}</Typography>
            <Typography variant="body2" color="text.secondary">
              请用 1-2 分钟描述你看到的内容与联想。
            </Typography>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            正在加载刺激材料...
          </Typography>
        </Box>
      )}
    </Card>
  );
};
