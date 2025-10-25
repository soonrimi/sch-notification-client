'use client';

import { Alert, Snackbar } from '@mui/material';
import { useNotification } from './useNotification';

export default function Notification() {
  const { message, severity, setNotificationMessage } = useNotification();

  function onClose() {
    setNotificationMessage('', severity);
  }

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
}
