import { AdminControllerService, AdminUserResponse, Department } from '@/api';
import { atom, useAtom } from 'jotai';
import { useEffect, useState } from 'react';

const adminUserListAtom = atom<AdminUserResponse[]>([]);

export default function useAdminManage() {
  const [adminUserList, setAdminUserList] = useAtom(adminUserListAtom);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);

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
    // AdminUpdateRequest로 변환
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
    // SignupRequest로 변환
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
    adminUserList,
    fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
    departmentList,
  };
}
