import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { AdminControllerService, AdminUserResponse, Department } from '@/api';

const selectedUserAtom = atom<AdminUserResponse | null>(null);
const adminUserListAtom = atom<AdminUserResponse[]>([]);
const departmentListAtom = atom<Department[]>([]);
const modeAtom = atom<'view' | 'add' | 'edit'>('view');

export default function useAdminManage() {
  const [mode, setMode] = useAtom(modeAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [adminUserList, setAdminUserList] = useAtom(adminUserListAtom);
  const [departmentList, setDepartmentList] = useAtom(departmentListAtom);

  useEffect(() => {
    if (adminUserList.length === 0) {
      fetchAdminUsers();
    }
    if (departmentList.length === 0) {
      fetchDepartments();
    }
  }, []);

  async function fetchDepartments() {
    const data = await AdminControllerService.getAllDepartment();
    setDepartmentList(data);
  }

  async function fetchAdminUsers() {
    const data = await AdminControllerService.getAllAdmins();
    setAdminUserList(data);
  }

  async function updateAdminUser(
    updatedUser: AdminUserResponse,
    requestPassword: string
  ) {
    const data = await AdminControllerService.updateAdmin(updatedUser.id, {
      name: updatedUser.name,
      affiliation: updatedUser.affiliation,
      registerPassword: requestPassword,
      password: undefined, // 비밀번호 변경이 필요할 때만 전달
      categories: updatedUser.categories ?? [],
      departmentIds: updatedUser.departments
        ? updatedUser.departments.map((d) => d.id ?? 0)
        : [],
      grades: updatedUser.grades ?? [],
    });
    setAdminUserList((prevList) =>
      prevList.map((user) => (user.id === data.id ? data : user))
    );
    return data;
  }

  async function createAdminUser(
    newUser: AdminUserResponse & { password: string; registerPassword: string }
  ) {
    await AdminControllerService.register({
      userId: newUser.userId,
      password: newUser.password,
      name: newUser.name,
      affiliation: newUser.affiliation,
      registerPassword: newUser.registerPassword,
      categories: newUser.categories ?? [],
      departmentIds: newUser.departments
        ? newUser.departments.map((d) => d.id ?? 0)
        : [],
      grades: newUser.grades ?? [],
    });
  }

  return {
    selectedUser,
    setSelectedUser,
    departmentList,
    adminUserList,
    fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
    mode,
    setMode,
  };
}
