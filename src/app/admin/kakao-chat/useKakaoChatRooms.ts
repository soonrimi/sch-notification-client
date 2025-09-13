import {
  KakaoRoomInfoControllerService,
  KakaoRoomInfoResponse,
  Service,
  AdminControllerService,
  Department,
  CreateInternalNoticeRequest,
} from '@/api';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { atom } from 'jotai';

const roomsAtom = atom<KakaoRoomInfoResponse[]>([]);
const loadingAtom = atom(false);
const errorAtom = atom<string | null>(null);
const roomNameAtom = atom('');
const targetYearAtom = atom(CreateInternalNoticeRequest.targetYear.ALL_YEARS);
const departmentIdAtom = atom<number>(0);
const addingAtom = atom(false);
const editingIdAtom = atom<number | null>(null);
const editRoomNameAtom = atom('');
const editTargetYearAtom = atom(
  CreateInternalNoticeRequest.targetYear.ALL_YEARS
);
const editDepartmentIdAtom = atom<number>(0);

const editingAtom = atom(false);
const departmentsAtom = atom<Department[]>([]);
const departmentsLoadingAtom = atom(false);
const departmentsErrorAtom = atom<string | null>(null);

export function useKakaoChatRooms() {
  const [rooms, setRooms] = useAtom(roomsAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [error, setError] = useAtom(errorAtom);
  const [roomName, setRoomName] = useAtom(roomNameAtom);
  const [targetYear, setTargetYear] = useAtom(targetYearAtom);
  // departmentId is now controlled by department selection in the UI
  const [departmentId, setDepartmentId] = useAtom(departmentIdAtom); // keep for compatibility, but not used in addRoom
  const [adding, setAdding] = useAtom(addingAtom);
  const [editingId, setEditingId] = useAtom(editingIdAtom);
  const [editRoomName, setEditRoomName] = useAtom(editRoomNameAtom);
  const [editTargetYear, setEditTargetYear] = useAtom(editTargetYearAtom);
  const [editDepartmentId, setEditDepartmentId] = useAtom(editDepartmentIdAtom);
  const [editing, setEditing] = useAtom(editingAtom);
  const [departments, setDepartments] = useAtom(departmentsAtom);
  const [departmentsLoading, setDepartmentsLoading] = useAtom(
    departmentsLoadingAtom
  );
  const [departmentsError, setDepartmentsError] = useAtom(departmentsErrorAtom);
  // 학과 목록 불러오기
  async function fetchDepartments() {
    setDepartmentsLoading(true);
    setDepartmentsError(null);
    try {
      const data = await AdminControllerService.getAllDepartment();
      setDepartments(data);
    } catch (e) {
      setDepartmentsError(e?.message || '학과 목록을 불러오지 못했습니다.');
    } finally {
      setDepartmentsLoading(false);
    }
  }

  // 방 목록 불러오기
  async function fetchRooms() {
    setLoading(true);
    setError(null);
    try {
      // 전체 목록 조회 (필터 없이)
      const data = await Service.getRoomsByFilter();
      setRooms(data);
    } catch (e) {
      setError(e?.message || '채팅방 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (rooms.length === 0 && departments.length === 0) {
      fetchRooms();
      fetchDepartments();
    }
  }, []);

  // 방 추가
  // lessonId is now passed as an argument (from department selection)
  const addRoom = async (selectedDepartmentId: number) => {
    if (!roomName) return;
    setAdding(true);
    setError(null);
    try {
      await KakaoRoomInfoControllerService.createRoom({
        roomName,
        targetYear,
        departmentId:
          selectedDepartmentId === 0 ? undefined : selectedDepartmentId,
      });
      setRoomName('');
      setDepartmentId(0);
      await fetchRooms();
    } catch (e) {
      setError(e?.message || '채팅방 추가에 실패했습니다.');
    } finally {
      setAdding(false);
    }
  };

  // 방 삭제
  const removeRoom = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await KakaoRoomInfoControllerService.deleteRoom(id);
      await fetchRooms();
    } catch (e) {
      setError(e?.message || '채팅방 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 방 수정
  const handleEditClick = (room: KakaoRoomInfoResponse) => {
    setEditingId(room.id ?? null);
    setEditRoomName(room.roomName || '');
    setEditTargetYear(
      room.targetYear || CreateInternalNoticeRequest.targetYear.ALL_YEARS
    );
    setEditDepartmentId(room.department?.id ?? 0); // departmentId
  };

  const updateRoom = async () => {
    if (editingId == null) return;
    setEditing(true);
    setError(null);
    try {
      await KakaoRoomInfoControllerService.updateRoom(editingId, {
        roomName: editRoomName,
        targetYear: editTargetYear,
        departmentId: editDepartmentId,
      });
      setEditingId(null);
      await fetchRooms();
    } catch (e) {
      setError(e?.message || '채팅방 수정에 실패했습니다.');
    } finally {
      setEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    // 추가 관련
    roomName,
    setRoomName,
    targetYear,
    setTargetYear,
    departmentId,
    setDepartmentId,
    adding,
    addRoom,
    // 수정 관련
    editingId,
    editRoomName,
    setEditRoomName,
    editTargetYear,
    setEditTargetYear,
    editDepartmentId,
    setEditDepartmentId,
    editing,
    handleEditClick,
    updateRoom,
    cancelEdit,
    // 삭제
    removeRoom,
    // 학과
    departments,
    departmentsLoading,
    departmentsError,
  };
}
