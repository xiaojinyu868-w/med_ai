import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';

const titles: Record<string, string> = {
  '/scale': '量表测评',
  '/visual-narrative': '看图说话',
  '/diagnosis': '智能诊疗',
  '/report': '综合报告',
  '/intervention': '干预占位',
};

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? '心理健康多模态诊断';

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f6ff 0%, #ffffff 100%)' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', pt: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/scale"
            sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}
          >
            MindMVP
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};
