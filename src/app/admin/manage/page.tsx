'use client';
import { useState } from 'react';
import styles from './page.module.css';
import UserList from './UserList';
import UserDetail from './UserDetail';
import SearchIcon from '@mui/icons-material/Search';
import useAdminManage from './useAdminManage';
import { AdminUserResponse } from '@/api';

type Mode = 'view' | 'add' | 'edit';

export default function ManagePage() {
  const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(
    null
  );
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<Mode>('view');

  const [filterRole, setFilterRole] = useState('전체');
  const { adminUserList, fetchAdminUsers, updateAdminUser, createAdminUser } =
    useAdminManage();

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

  const handleSave = (newUser: AdminUserResponse, mode: Mode) => {
    if (mode === 'add') {
      createAdminUser(newUser);
    } else if (mode === 'edit') {
      updateAdminUser(newUser);
    }
    fetchAdminUsers();
    setSelectedUser(newUser);
    setMode('view');
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.leftTop}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="사용자 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" onClick={() => console.log('검색 실행')}>
              <SearchIcon />
            </button>
          </div>

          <div className={styles.filterBox}>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="학과">학과</option>
              <option value="학년">학년</option>
              <option value="학생회">학생회</option>
              <option value="교직원">교직원</option>
            </select>
          </div>
        </div>
        <div className={styles.userTableWrapper}>
          <UserList
            users={filtered}
            onSelect={(u) => {
              setSelectedUser(u);
              setMode('view');
            }}
            selectedUser={selectedUser}
          />
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.btnGroup}>
          <button type="button" onClick={handleAdd}>
            추가
          </button>
          <button type="button" onClick={handleEdit} disabled={!selectedUser}>
            수정
          </button>
          <button type="button" onClick={handleDelete} disabled={!selectedUser}>
            삭제
          </button>
        </div>
        <UserDetail
          user={selectedUser}
          mode={mode}
          onSave={handleSave}
          onCancel={() => setMode('view')}
        />
      </div>
    </div>
  );
}
