import { AlertColor, AlertPropsColorOverrides } from '@mui/material';
import { atom, useAtom } from 'jotai';

type Severity = AlertColor;

const notificationMessageAtom = atom<string>('');
const notificationDuration = 3000;
const messageSeverityAtom = atom<Severity>('info');

export function useNotification() {
  const [message, setMessage] = useAtom(notificationMessageAtom);
  const [severity, setSeverity] = useAtom(messageSeverityAtom);

  function setNotificationMessage(
    message: string,
    severity: Severity = 'info'
  ) {
    setMessage(message);
    setSeverity(severity);
    setTimeout(() => {
      setMessage('');
    }, notificationDuration);
  }

  return { message, severity, setNotificationMessage };
}
