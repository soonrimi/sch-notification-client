'use client';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { AdminUserResponse } from '@/api';

type User = {
  password: string;
} & AdminUserResponse;

interface Props {
  user: AdminUserResponse | null;
  mode: 'view' | 'add' | 'edit';
  onSave: (user: User, mode: 'add' | 'edit') => void;
  onCancel: () => void;
}

const boardList = ['학교', '대학', '학과', '학년', '채용', '활동', '홍보'];

export default function UserDetail({ user, mode, onSave, onCancel }: Props) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<AdminUserResponse.role>(
    AdminUserResponse.role.ADMIN
  );

  useEffect(() => {
    if (user && mode !== 'add') {
      setUserId(user.userId);
      setName(user.name);
      setRole(user.role);
    } else {
      setUserId('');
      setPassword('');
      setName('');
      setRole(AdminUserResponse.role.ADMIN);
    }
  }, [user, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password || !name || !role) {
      alert('필수 항목을 작성해주세요.');
      return;
    }
    const newUser: User = {
      id: user?.id || 0,
      userId,
      password,
      name,
      affiliation: '',
      role,
    };
    if (mode === 'add' || mode === 'edit') {
      onSave(newUser, mode);
    }
  };

  if (mode === 'view' || mode === 'edit' || mode === 'add') {
    return (
      <div className={styles.userDetail}>
        <h3>
          {mode === 'view'
            ? '사용자 정보'
            : mode === 'edit'
              ? '사용자 수정'
              : '새 사용자 추가'}
        </h3>

        <form className={styles.detailForm} onSubmit={handleSubmit}>
          <label>
            아이디 *
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={mode === 'view'}
            />
          </label>
          <label>
            비밀번호 *
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={mode === 'view'}
            />
          </label>
          <label>
            이름 *
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={mode === 'view'}
            />
          </label>
          <label>
            소속 *
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as AdminUserResponse.role)
              }
              required
              disabled={mode === 'view'}
            >
              <option value="">선택</option>
              <option>학과</option>
              <option>학년</option>
              <option>학생회</option>
              <option>교직원</option>
            </select>
          </label>

          <label>게시판 권한 *</label>
          <div className={styles.boardCheckboxes}>
            {/*boardList.map((board) => (
              <div key={board}>
                <input
                  type="checkbox"
                  checked={boardPermissions.includes(board)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setBoardPermissions([...boardPermissions, board]);
                    } else {
                      setBoardPermissions(
                        boardPermissions.filter((b) => b !== board)
                      );
                    }
                  }}
                  disabled={mode === 'view'}
                />
                {board}
              </div>
            ))*/}
          </div>

          <label>
            비고
            <textarea rows={5} disabled={mode === 'view'} />
          </label>

          <div className={styles.formButtons}>
            {(mode === 'edit' || mode === 'add') && (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onCancel}
              >
                취소
              </button>
            )}

            {mode !== 'view' && (
              <button type="submit" className={styles.saveBtn}>
                저장
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return <div></div>;
}
