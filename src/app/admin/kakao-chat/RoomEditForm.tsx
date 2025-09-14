import { Stack, TextField, Button, Select, MenuItem } from '@mui/material';

import { useKakaoChatRooms } from './useKakaoChatRooms';
import { CreateInternalNoticeRequest } from '@/api';

export default function RoomEditForm() {
  const {
    updateRoom,
    cancelEdit,
    editRoomName,
    setEditRoomName,
    editTargetYear,
    setEditTargetYear,
    editDepartmentId,
    setEditDepartmentId,
    editing,
    departments,
  } = useKakaoChatRooms();

  return (
    <Stack direction="row" spacing={1} alignItems="center" width="100%">
      <TextField
        label="채팅방 이름"
        value={editRoomName}
        onChange={(e) => setEditRoomName(e.target.value)}
        size="small"
        sx={{ flex: 1 }}
      />
      <Select
        label="연도"
        value={editTargetYear}
        onChange={(e) => setEditTargetYear(e.target.value)}
        size="small"
      >
        <MenuItem value={CreateInternalNoticeRequest.targetYear.ALL_YEARS}>
          전체
        </MenuItem>
        <MenuItem value={CreateInternalNoticeRequest.targetYear.FIRST_YEAR}>
          1학년
        </MenuItem>
        <MenuItem value={CreateInternalNoticeRequest.targetYear.SECOND_YEAR}>
          2학년
        </MenuItem>
        <MenuItem value={CreateInternalNoticeRequest.targetYear.THIRD_YEAR}>
          3학년
        </MenuItem>
        <MenuItem value={CreateInternalNoticeRequest.targetYear.FOURTH_YEAR}>
          4학년
        </MenuItem>
      </Select>
      <Select
        label="학과"
        value={editDepartmentId}
        onChange={(e) =>
          setEditDepartmentId(!e.target.value ? 0 : Number(e.target.value))
        }
        size="small"
        type="number"
        sx={{ width: 100 }}
      >
        <MenuItem value="">전체</MenuItem>
        {departments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.name}
          </MenuItem>
        ))}
      </Select>
      <Button onClick={updateRoom} disabled={editing} sx={{ mr: 1 }}>
        저장
      </Button>
      <Button onClick={cancelEdit} disabled={editing} color="inherit">
        취소
      </Button>
    </Stack>
  );
}
