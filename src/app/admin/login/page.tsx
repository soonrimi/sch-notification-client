'use client';

import { useState } from 'react';
import {
  Button,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAdminInfo from '../useAdminInfo';
import styles from './login.module.css';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState('');

  const { login, didSendOtp, verifyOTP } = useAdminInfo();

  const canSubmit = id.trim().length > 0 && password.trim().length > 0;

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSubmit) return;
    if (didSendOtp) {
      verifyOTP({ id, otp: Number(otp) });
      return;
    }
    login({ id, password });
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.card} onSubmit={onSubmit} noValidate>
        <header className={styles.header}>
          <Typography component="h1" className={styles.brand}>
            SOONRIMI
          </Typography>
          <p className={styles.sub}>관리자 로그인</p>
        </header>

        <Stack className={styles.inputs} gap={1.5}>
          <TextField
            value={id}
            label="아이디"
            disabled={didSendOtp}
            autoComplete="username"
            variant="filled"
            onChange={(e) => setId(e.target.value)}
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: {
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.04)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.06)' },
                '&.Mui-focused': { backgroundColor: 'rgba(0,0,0,0.03)' },
              },
            }}
          />

          <TextField
            label="비밀번호"
            value={password}
            disabled={didSendOtp}
            type={showPw ? 'text' : 'password'}
            autoComplete="current-password"
            variant="filled"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="비밀번호 표시"
                    onClick={() => setShowPw((v) => !v)}
                    edge="end"
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.04)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.06)' },
                '&.Mui-focused': { backgroundColor: 'rgba(0,0,0,0.03)' },
              },
            }}
          />

          {didSendOtp && (
            <TextField
              label="OTP 코드"
              type={showPw ? 'text' : 'password'}
              value={otp}
              autoComplete="current-password"
              variant="filled"
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="비밀번호 표시"
                      onClick={() => setShowPw((v) => !v)}
                      edge="end"
                    >
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.06)' },
                  '&.Mui-focused': { backgroundColor: 'rgba(0,0,0,0.03)' },
                },
              }}
            />
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit}
            className={styles.submit}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontWeight: 700,
              letterSpacing: 0.2,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #4f46e5 0%, #60a5fa 100%)',
              boxShadow: '0 8px 22px rgba(79,70,229,0.18)',
              '&:hover': {
                boxShadow: '0 10px 26px rgba(79,70,229,0.28)',
              },
              '&.Mui-disabled': {
                background: '#e5e7eb',
                color: '#9ca3af',
                boxShadow: 'none',
              },
            }}
          >
            {didSendOtp ? 'OTP 인증' : '로그인'}
          </Button>
        </Stack>
      </form>
    </div>
  );
}
