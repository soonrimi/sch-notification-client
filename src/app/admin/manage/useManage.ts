import {
  AdminControllerService,
  AdminUpdateRequest,
  AdminUserResponse,
} from '@/api';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const adminUserListAtom = atom<AdminUserResponse[]>([]);

export default function useManage() {
  const [adminUserList, setAdminUserList] = useAtom(adminUserListAtom);

  useEffect(() => {
    if (adminUserList.length === 0) {
      fetchAdminUsers();
    }
  }, []);

  async function fetchAdminUsers() {
    const data = await AdminControllerService.getAllAdmins();
    setAdminUserList(data);
  }

  async function updateAdminUser(updatedUser: AdminUpdateRequest) {
    const data = await AdminControllerService.updateAdmin(updatedUser);
    setAdminUserList((prevList) =>
      prevList.map((user) => (user.id === data.id ? data : user))
    );
    return data;
  }
}
