'use client';
import { useState } from 'react';
import styles from './page.module.css';
import UserList from './UserList';
import UserDetail from './UserDetail';
import { User, dummyUsers } from './dummyUsers';
import SearchIcon from '@mui/icons-material/Search';

type Mode = 'view' | 'add' | 'edit';

export default function ManagePage() {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<Mode>('view');

  const [filterRole, setFilterRole] = useState('전체');

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === '전체' ? true : u.group === filterRole;
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
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        setSelectedUser(null);
        setMode('view');
      }
    }
  };

  const handleSave = (newUser: User, mode: Mode) => {
    if (mode === 'add') {
      setUsers((prev) => [...prev, { ...newUser, id: `u${Date.now()}` }]);
    } else if (mode === 'edit') {
      setUsers((prev) => prev.map((u) => (u.id === newUser.id ? newUser : u)));
    }
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
