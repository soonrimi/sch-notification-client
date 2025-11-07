import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminControllerService } from '@/api';
import { useNotification } from '@/Components/notification/useNotification';

const adminJwt = atom<string | null>(null);

export default function useAdminInfo() {
  const { push } = useRouter();
  const [didSendOtp, setDidSendOtp] = useState(false);
  const [adminToken, setAdminToken] = useAtom(adminJwt);
  const { setNotificationMessage } = useNotification();

  useEffect(() => {
    fetchAdminInfo();
  }, [fetchAdminInfo]);

  async function fetchAdminInfo() {
    if (adminToken) return;
    const token = localStorage.getItem('accessToken');
    setAdminToken(token || '');
    if (!token) return;
  }

  async function login({ id, password }: { id: string; password: string }) {
    const data = await AdminControllerService.loginEmail({
      userId: id,
      password: password,
    });
    setNotificationMessage(data);
    setDidSendOtp(true);
  }

  async function verifyOTP({ id, otp }: { id: string; otp: number }) {
    const data = await AdminControllerService.verifyOtp({
      userId: id,
      otp,
    });
    setAdminToken(data.token);
    localStorage.setItem('accessToken', data.token || '');
    push('/admin');
  }

  return {
    adminToken,
    login,
    verifyOTP,
    didSendOtp,
  };
}
