import React from 'react';
import { AdminUserResponse } from '@/api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type Props = {
  users: AdminUserResponse[];
  search: string;
  setSearch: (v: string) => void;
  filterRole: string;
  setFilterRole: (v: string) => void;
  selectedUser: AdminUserResponse | null;
  setSelectedUser: (u: AdminUserResponse) => void;
  setMode: (m: 'view') => void;
};

export default function AdminUserTable({
  users,
  search,
  setSearch,
  filterRole,
  setFilterRole,
  selectedUser,
  setSelectedUser,
  setMode,
}: Props) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        minWidth: 340,
        marginLeft: 'auto',
        borderRadius: 2,
        p: 2,
        background: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="사용자 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, background: '#f5f7fa', borderRadius: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            displayEmpty
          >
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="학과">학과</MenuItem>
            <MenuItem value="학년">학년</MenuItem>
            <MenuItem value="학생회">학생회</MenuItem>
            <MenuItem value="교직원">교직원</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>소속</TableCell>
              <TableCell>학과</TableCell>
              <TableCell>비고</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u, idx) => (
              <TableRow
                key={u.id}
                hover
                selected={selectedUser?.id === u.id}
                onClick={() => {
                  setSelectedUser(u);
                  setMode('view');
                }}
                sx={{
                  cursor: 'pointer',
                  background: selectedUser?.id === u.id ? '#e6f0ff' : undefined,
                }}
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.affiliation}</TableCell>
                <TableCell>{u.departments?.join(', ')}</TableCell>
                <TableCell>{/* 비고 정보 필요시 여기에 */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
