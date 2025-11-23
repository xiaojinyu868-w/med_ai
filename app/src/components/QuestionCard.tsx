import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useRef } from 'react';
import type { Question } from '../types';
import { useDwellTime } from '../hooks/useDwellTime';

type Props = {
  question: Question;
  selected?: string;
  onSelect: (value: string) => void;
  onPrev?: () => void;
  isLast: boolean;
  onSubmitLast?: () => void;
  onRecordDwell: (dwellTimeMs: number, value?: string | null) => void;
};

export const QuestionCard = ({
  question,
  selected,
  onSelect,
  onPrev,
  isLast,
  onSubmitLast,
  onRecordDwell,
}: Props) => {
  const lastValueRef = useRef<string | null>(selected ?? null);
  const { stop } = useDwellTime((ms) => {
    onRecordDwell(ms, lastValueRef.current);
  });

  const sortedOptions = useMemo(() => question.options, [question.options]);

  const handleSelect = (value: string) => {
    lastValueRef.current = value;
    stop();
    onSelect(value);
  };

  const handlePrev = () => {
    lastValueRef.current = selected ?? null;
    stop();
    onPrev?.();
  };

  const handleSubmit = () => {
    if (!selected) return;
    lastValueRef.current = selected;
    stop();
    onSubmitLast?.();
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {question.title}
        </Typography>
        <List>
          {sortedOptions.map((opt) => (
            <ListItemButton
              key={opt}
              selected={selected === opt}
              onClick={() => handleSelect(opt)}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemText primary={opt} />
            </ListItemButton>
          ))}
        </List>

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
          <Button variant="text" disabled={!onPrev} onClick={handlePrev}>
            上一题
          </Button>
          <Box>
            {isLast && selected ? (
              <Button variant="contained" onClick={handleSubmit}>
                提交并进入下一环节
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                点击选项后自动进入下一题
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
