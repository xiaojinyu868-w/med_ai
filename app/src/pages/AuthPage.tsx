import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";
import { loginSuccess } from "../store/authSlice";

type AuthMode = "login" | "register";

export const AuthPage = ({ mode }: { mode: AuthMode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [className, setClassName] = useState("");
  const [role, setRole] = useState<"student" | "school_admin">("student");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!phone || !password || !name) {
      setError("请填写必填项");
      return;
    }
    setError(null);
    // 前端占位：直接生成 token 与用户信息
    const token = `mock_${Date.now()}`;
    dispatch(
      loginSuccess({
        token,
        user: { id: phone, name, role, school, className },
      }),
    );
    navigate("/scale");
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper sx={{ p: 3, maxWidth: 480, width: "100%" }} elevation={1}>
        <Typography variant="h6" gutterBottom>
          {mode === "login" ? "登录" : "注册"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="姓名"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="手机号/学号"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            label="密码"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="学校"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
          <TextField
            label="班级"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <TextField
            select
            SelectProps={{ native: true }}
            label="角色"
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "student" | "school_admin")
            }
          >
            <option value="student">学生</option>
            <option value="school_admin">学校端</option>
          </TextField>
          <Button variant="contained" onClick={handleSubmit}>
            {mode === "login" ? "登录" : "注册"}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Paper>
    </Box>
  );
};
