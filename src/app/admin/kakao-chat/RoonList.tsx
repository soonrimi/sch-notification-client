import { CreateInternalNoticeRequest, KakaoRoomInfoResponse } from '@/api';
import DeleteIcon from '@mui/icons-material/Delete';
import RoomEditForm from './RoomEditForm';
import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useKakaoChatRooms } from './useKakaoChatRooms';

export default function RoomList({
  filterDepartment,
  filterYear,
}: {
  filterDepartment: number;
  filterYear: string;
}) {
  const {
    loading,
    rooms,
    removeRoom,
    handleEditClick,
    departments,
    editingId,
  } = useKakaoChatRooms();

  // 필터링된 rooms
  const filteredRooms = rooms.filter((room: KakaoRoomInfoResponse) => {
    const matchDepartment =
      filterDepartment === 0 || room.department?.id === filterDepartment;
    const matchYear =
      filterYear === 'ALL' || String(room.targetYear) === filterYear;
    return matchDepartment && matchYear;
  });

  function getDepartmentName(departmentId: number | '') {
    if (departmentId === '') return '전체';
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : 'NULL';
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
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <List>
      {filteredRooms.map((room: KakaoRoomInfoResponse) => (
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
