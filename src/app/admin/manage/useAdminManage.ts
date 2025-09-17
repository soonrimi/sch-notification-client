import {
  AdminControllerService,
  AdminUpdateRequest,
  AdminUserResponse,
} from '@/api';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const adminUserListAtom = atom<AdminUserResponse[]>([]);

export default function useAdminManage() {
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

  async function updateAdminUser(updatedUser: AdminUserResponse) {
    const data = await AdminControllerService.updateAdmin(
      updatedUser.id,
      updatedUser
    );
    setAdminUserList((prevList) =>
      prevList.map((user) => (user.id === data.id ? data : user))
    );
    return data;
  }

  async function createAdminUser(newUser: AdminUserResponse) {
    await AdminControllerService.register(newUser);
  }

  return {
    adminUserList,
    fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
  };
}
