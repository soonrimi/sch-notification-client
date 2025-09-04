import { AdminControllerService } from '@/api';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const adminJwt = atom<string>('');

export default function useAdminInfo() {
  const { push } = useRouter();
  const [adminToken, setAdminToken] = useAtom(adminJwt);

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  async function fetchAdminInfo() {
    if (adminToken) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
  }

  async function login({ id, password }: { id: string; password: string }) {
    const data = await AdminControllerService.login({
      userId: id,
      password: password,
    });
    setAdminToken(data.token || '');
    localStorage.setItem('accessToken', data.token || '');
    push('/admin');
  }

  return {
    adminToken,
    login,
  };
}
