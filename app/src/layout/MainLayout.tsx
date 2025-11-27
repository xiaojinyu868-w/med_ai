import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import type { PropsWithChildren } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/authSlice";

const titles: Record<string, string> = {
  "/scale": "量表测评",
  "/visual-narrative": "看图描述",
  "/reading": "情绪阅读",
  "/interview": "半结构访谈",
  "/diagnosis": "智能诊疗",
  "/report": "综合报告",
  "/intervention": "干预占位",
  "/school/dashboard": "学校端数据",
  "/login": "登录",
  "/register": "注册",
};

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "心理健康多模态诊断";
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f6ff 0%, #ffffff 100%)",
      }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ backdropFilter: "blur(10px)", pt: 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/scale"
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            MindMVP
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle1" color="text.secondary">
              {title}
            </Typography>
            {user ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  {user.name}（
                  {user.role === "school_admin" ? "学校端" : "学生"}）
                </Typography>
                <Button size="small" onClick={() => dispatch(logout())}>
                  退出
                </Button>
              </>
            ) : (
              <Button size="small" onClick={() => navigate("/login")}>
                登录/注册
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};
