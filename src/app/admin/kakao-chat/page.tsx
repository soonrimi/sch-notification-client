'use client';

import React from 'react';

import Header from '../components/Header';
import {
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Select,
  MenuItem,
} from '@mui/material';
import { useKakaoChatRooms } from './useKakaoChatRooms';
import { CreateInternalNoticeRequest, KakaoRoomInfoResponse } from '@/api';
import RoomList from './RoonList';

export default function KakaoChatAdminPage() {
  const {
    error,
    addRoom,
    roomName,
    setRoomName,
    targetYear,
    setTargetYear,
    adding,
    departments,
    departmentsLoading,
    departmentsError,
  } = useKakaoChatRooms();

  // 필터 상태
  const [filterDepartment, setFilterDepartment] = React.useState<number>(0);
  const [filterYear, setFilterYear] = React.useState<string>('ALL');

  // 선택된 학과 상태 (id)
  const [selectedDepartment, setSelectedDepartment] = React.useState<number>(0);

  return (
    <>
      <Header />
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          카카오 채팅방 관리
        </Typography>
        {/* 필터 영역 */}
        <Stack
          direction="row"
          spacing={2}
          mb={2}
          border="1px solid #ccc"
          p={2}
          borderRadius={1}
        >
          <Select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(Number(e.target.value))}
            size="small"
            sx={{ minWidth: 120 }}
            disabled={departmentsLoading}
          >
            <MenuItem value={0}>전체 학과</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            size="small"
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="ALL">모두 보기</MenuItem>
            <MenuItem
              value={String(CreateInternalNoticeRequest.targetYear.ALL_YEARS)}
            >
              전체 학년
            </MenuItem>
            <MenuItem
              value={String(CreateInternalNoticeRequest.targetYear.FIRST_YEAR)}
            >
              1학년
            </MenuItem>
            <MenuItem
              value={String(CreateInternalNoticeRequest.targetYear.SECOND_YEAR)}
            >
              2학년
            </MenuItem>
            <MenuItem
              value={String(CreateInternalNoticeRequest.targetYear.THIRD_YEAR)}
            >
              3학년
            </MenuItem>
            <MenuItem
              value={String(CreateInternalNoticeRequest.targetYear.FOURTH_YEAR)}
            >
              4학년
            </MenuItem>
          </Select>
        </Stack>
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
              전체 학년
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
        <RoomList filterDepartment={filterDepartment} filterYear={filterYear} />
      </Box>
    </>
  );
}
