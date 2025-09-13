'use client';

import React from 'react';

import Header from '../components/Header';
import {
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RoomEditForm from './RoomEditForm';
import { useKakaoChatRooms } from './useKakaoChatRooms';
import { CreateInternalNoticeRequest, KakaoRoomInfoResponse } from '@/api';

export default function KakaoChatAdminPage() {
  const {
    rooms,
    loading,
    error,
    addRoom,
    removeRoom,
    handleEditClick,
    roomName,
    setRoomName,
    targetYear,
    setTargetYear,
    adding,
    editingId,
    departments,
    departmentsLoading,
    departmentsError,
  } = useKakaoChatRooms();

  // 선택된 학과 상태 (id)
  const [selectedDepartment, setSelectedDepartment] = React.useState<number>(0);

  function getDepartmentName(departmentId: number | '') {
    if (departmentId === '') return '전체';
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : '알 수 없음';
  }

  function getYearName(year: CreateInternalNoticeRequest['targetYear']) {
    switch (year) {
      case CreateInternalNoticeRequest.targetYear.ALL_YEARS:
        return '전체';
      case CreateInternalNoticeRequest.targetYear.FIRST_YEAR:
        return '1학년';
      case CreateInternalNoticeRequest.targetYear.SECOND_YEAR:
        return '2학년';
      case CreateInternalNoticeRequest.targetYear.THIRD_YEAR:
        return '3학년';
      case CreateInternalNoticeRequest.targetYear.FOURTH_YEAR:
        return '4학년';
      default:
        return '-';
    }
  }

  function RoomList() {
    if (loading) {
      return <CircularProgress />;
    }

    return (
      <List>
        {rooms.map((room: KakaoRoomInfoResponse) => (
          <ListItem
            key={room.id}
            secondaryAction={
              editingId !== room.id && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeRoom(room.id!)}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
            onClick={() => {
              if (editingId !== room.id) handleEditClick(room);
            }}
            sx={{ cursor: 'pointer' }}
          >
            {editingId === room.id ? (
              <RoomEditForm />
            ) : (
              <ListItemText
                primary={room.roomName}
                secondary={`학년: ${getYearName(room.targetYear)} / 학과: ${getDepartmentName(room.department?.id || '')}`}
              />
            )}
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <>
      <Header />
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          카카오 채팅방 관리
        </Typography>
        <Stack direction="row" spacing={2} mb={2}>
          <Select
            label="학과"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
            disabled={departmentsLoading}
          >
            <MenuItem value={0}>전체</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
          {departmentsLoading && (
            <CircularProgress size={20} sx={{ alignSelf: 'center' }} />
          )}
          {departmentsError && (
            <Alert severity="error" sx={{ mb: 2, minWidth: 200 }}>
              {departmentsError}
            </Alert>
          )}
          <TextField
            label="채팅방 이름"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            size="small"
          />
          <Select
            label="연도"
            value={targetYear}
            onChange={(e) => setTargetYear(e.target.value)}
            size="small"
          >
            <MenuItem value={CreateInternalNoticeRequest.targetYear.ALL_YEARS}>
              전체
            </MenuItem>
            <MenuItem value={CreateInternalNoticeRequest.targetYear.FIRST_YEAR}>
              1학년
            </MenuItem>
            <MenuItem
              value={CreateInternalNoticeRequest.targetYear.SECOND_YEAR}
            >
              2학년
            </MenuItem>
            <MenuItem value={CreateInternalNoticeRequest.targetYear.THIRD_YEAR}>
              3학년
            </MenuItem>
            <MenuItem
              value={CreateInternalNoticeRequest.targetYear.FOURTH_YEAR}
            >
              4학년
            </MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={() => addRoom(selectedDepartment)}
            disabled={adding || !roomName}
          >
            추가
          </Button>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <RoomList />
      </Box>
    </>
  );
}
