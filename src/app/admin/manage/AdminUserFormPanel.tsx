import React from 'react';
import { AdminUserResponse } from '@/api';
import type { Department } from '@/api';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UserDetail from './UserDetail';

type Mode = 'view' | 'add' | 'edit';

type Props = {
  selectedUser: AdminUserResponse | null;
  mode: Mode;
  handleAdd: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleSave: (
    newUser: AdminUserResponse & {
      password: string;
      registerPassword: string;
      categories: AdminUserResponse['categories'];
      departments: Department[];
      grades: AdminUserResponse['grades'];
    },
    mode: Mode
  ) => void;
  departmentList: Department[];
  setMode: (m: Mode) => void;
};

export default function AdminUserFormPanel({
  selectedUser,
  mode,
  handleAdd,
  handleEdit,
  handleDelete,
  handleSave,
  departmentList,
  setMode,
}: Props) {
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
