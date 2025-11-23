import { Button, Stack, TextField } from '@mui/material';

type Props = {
  value: string;
  onChange: (value: string, cause?: 'edit') => void;
  onSubmit: () => void;
  disabled?: boolean;
  onKeyAction?: (type: 'delete' | 'move') => void;
};

export const ChatInput = ({ value, onChange, onSubmit, disabled, onKeyAction }: Props) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        fullWidth
        size="small"
        value={value}
        disabled={disabled}
        placeholder="输入与你的感受相关的问题或回复..."
        onChange={(e) => onChange(e.target.value, 'edit')}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            onKeyAction?.('delete');
          }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            onKeyAction?.('move');
          }
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <Button variant="contained" onClick={onSubmit} disabled={disabled || !value.trim()}>
        发送
      </Button>
    </Stack>
  );
};
