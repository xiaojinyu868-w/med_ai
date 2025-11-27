import { Chip, Paper, Stack, Typography, Button } from "@mui/material";
import type { ChatMessage } from "../types";

type Props = {
  messages: ChatMessage[];
  onOptionSelect: (id: string, option: string) => void;
  sending?: boolean;
};

export const ChatMessageList = ({
  messages,
  onOptionSelect,
  sending = false,
}: Props) => {
  return (
    <Stack spacing={2}>
      {messages.map((msg) => {
        const align = msg.role === "user" ? "flex-end" : "flex-start";
        const color = msg.role === "user" ? "secondary.main" : "grey.100";
        const textColor = msg.role === "user" ? "#fff" : "text.primary";

        if (msg.type === "options") {
          return (
            <Paper
              key={msg.id}
              sx={{
                p: 2,
                bgcolor: color,
                alignSelf: align,
                color: textColor,
                borderRadius: 3,
                minWidth: 220,
              }}
            >
              <Typography variant="body2" gutterBottom>
                {msg.content}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {msg.options.map((opt) => (
                  <Button
                    key={opt}
                    size="small"
                    variant="contained"
                    color="primary"
                    disabled={msg.disabled || sending}
                    onClick={() => onOptionSelect(msg.id, opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </Stack>
            </Paper>
          );
        }

        return (
          <Paper
            key={msg.id}
            sx={{
              p: 2,
              bgcolor: color,
              alignSelf: align,
              color: textColor,
              borderRadius: 3,
              maxWidth: "80%",
            }}
          >
            <Typography variant="body2">{msg.content}</Typography>
            {msg.role === "system" && (
              <Chip
                size="small"
                label="系统"
                sx={{ mt: 1, bgcolor: "#fff", color: "text.primary" }}
              />
            )}
          </Paper>
        );
      })}
    </Stack>
  );
};
