'use client';

import { Button, Stack, TextField } from '@mui/material';
import useAdminInfo from '../useAdminInfo';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const { push } = useRouter();
  const { login } = useAdminInfo();

  function onLogin() {
    login({ id, password });
    push('/admin');
  }

  return (
    <Stack
      className="centered"
      gap={2}
      width="100%"
      padding={2}
      justifyContent="center"
    >
      <h1>순천향대 공지 로그인</h1>
      <TextField
        value={id}
        label="아이디"
        variant="outlined"
        onChange={(e) => setId(e.target.value)}
      />
      <TextField
        label="비밀번호"
        type="password"
        value={password}
        variant="outlined"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" onClick={onLogin} disabled={!id || !password}>
        로그인
      </Button>
    </Stack>
  );
}
