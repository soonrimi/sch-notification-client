import React from 'react';
import UserDetail from './UserDetail';
import type { Department } from '@/api';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AdminUserResponse } from '@/api';
import useAdminManage from './useAdminManage';

export default function AdminUserFormPanel() {
  const {
    mode,
    setMode,
    selectedUser,
    departmentList,
    fetchAdminUsers,
    setSelectedUser,
    createAdminUser,
    updateAdminUser,
  } = useAdminManage();
  function handleSave(
    newUser: AdminUserResponse & {
      password: string;
      registerPassword: string;
      categories: AdminUserResponse['categories'];
      departments: Department[];
      grades: AdminUserResponse['grades'];
    }
  ) {
    try {
      if (mode === 'add') {
        createAdminUser(newUser);
      } else if (mode === 'edit') {
        updateAdminUser(newUser, newUser.registerPassword);
      }
    } catch (error) {
      // 오류 메시지는 axios에서 처리하므로 여기서는 생략
      return;
    }
    fetchAdminUsers();
    setSelectedUser(newUser);
    setMode('view');
  }

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

  return (
    <Paper
      elevation={3}
      sx={{
        flex: 1,
        minWidth: 380,
        maxWidth: 700,
        marginRight: 'auto',
        borderRadius: 2,
        p: 3,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          추가
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleEdit}
          disabled={!selectedUser}
        >
          수정
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={!selectedUser}
        >
          삭제
        </Button>
      </Stack>
      <UserDetail
        user={selectedUser}
        mode={mode}
        onSave={handleSave}
        onCancel={() => setMode('view')}
        departmentList={departmentList}
      />
    </Paper>
  );
}
