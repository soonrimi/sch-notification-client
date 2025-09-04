import { Admin, AdminControllerService, NoticeControllerService } from '@/api';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const adminInfoAtom = atom<Admin | null>(null);

export default function useAdminInfo() {
  const [adminInfo, setAdminInfo] = useAtom(adminInfoAtom);

  useEffect(() => {
    fetchAdminInfo();
  }, [fetchAdminInfo]);

  async function fetchAdminInfo() {
    if (adminInfo) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
  }

  async function login({ id, password }: { id: string; password: string }) {
    const data = await AdminControllerService.login({
      username: id,
      password: password,
    });
    setAdminInfo(data);
    localStorage.setItem('accessToken', data.token || '');
  }

  return {
    adminInfo,
    login,
  };
}
