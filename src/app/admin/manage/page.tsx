'use client';
import { useState } from 'react';
import { Stack } from '@mui/material';
import AdminUserTable from './AdminUserTable';
import useAdminManage from './useAdminManage';
import Header from '@/app/admin/components/Header';
import AdminUserFormPanel from './AdminUserFormPanel';

export default function ManagePage() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('전체');
  const { adminUserList } = useAdminManage();

  const filtered = adminUserList.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === '전체';
    return matchSearch && matchRole;
  });

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
        />
        <AdminUserFormPanel />
      </Stack>
    </Stack>
  );
}
