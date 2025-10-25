'use client';
import { useState } from 'react';
import styles from './page.module.css';
import AdminUserTable from './AdminUserTable';
import AdminUserFormPanel from './AdminUserFormPanel';
import useAdminManage from './useAdminManage';
import { AdminUserResponse } from '@/api';
import type { Department } from '@/api';
import Header from '@/app/admin/components/Header';
import { Stack } from '@mui/material';

type Mode = 'view' | 'add' | 'edit';

export default function ManagePage() {
  const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(
    null
  );
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<Mode>('view');

  const [filterRole, setFilterRole] = useState('전체');
  const {
    adminUserList,
    fetchAdminUsers,
    updateAdminUser,
    createAdminUser,
    departmentList,
  } = useAdminManage();

  const filtered = adminUserList.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === '전체';
    return matchSearch && matchRole;
  });

  const handleAdd = () => {
    setSelectedUser(null);
    setMode('add');
  };

  const handleEdit = () => {
    if (selectedUser) setMode('edit');
  };

  const handleDelete = () => {
    if (selectedUser) {
      const ok = window.confirm(
        `정말로 ${selectedUser.name} 사용자를 삭제하시겠습니까?`
      );
      if (ok) {
        fetchAdminUsers();
        setSelectedUser(null);
        setMode('view');
      }
    }
  };

  const handleSave = (
    newUser: AdminUserResponse & {
      password: string;
      registerPassword: string;
      categories: AdminUserResponse['categories'];
      departments: Department[];
      grades: AdminUserResponse['grades'];
    },
    mode: Mode
  ) => {
    if (mode === 'add') {
      createAdminUser(newUser);
    } else if (mode === 'edit') {
      updateAdminUser(newUser, newUser.registerPassword);
    }
    fetchAdminUsers();
    setSelectedUser(newUser);
    setMode('view');
  };

  return (
    <Stack height="100vh" gap="12px">
      <Header />
      <Stack direction="row" gap="12px" height="100%" padding="12px">
        <AdminUserTable
          users={filtered}
          search={search}
          setSearch={setSearch}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setMode={setMode}
        />
        <AdminUserFormPanel
          selectedUser={selectedUser}
          mode={mode}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleSave={handleSave}
          departmentList={departmentList}
          setMode={setMode}
        />
      </Stack>
    </Stack>
  );
}
