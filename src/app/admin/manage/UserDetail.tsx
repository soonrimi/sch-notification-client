'use client';
import { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from '@mui/material';
import styles from './styles.module.css';

import { AdminUserResponse, Department } from '@/api';
import { useEffect as useReactEffect } from 'react';

type User = {
  password: string;
  registerPassword: string;
  categories: Array<
    'UNIVERSITY' | 'DEPARTMENT' | 'GRADE' | 'RECRUIT' | 'ACTIVITY' | 'PROMOTION'
  >;
  departments: Department[];
  grades: Array<
    'ALL_YEARS' | 'FIRST_YEAR' | 'SECOND_YEAR' | 'THIRD_YEAR' | 'FOURTH_YEAR'
  >;
} & AdminUserResponse;

interface Props {
  user: AdminUserResponse | null;
  mode: 'view' | 'add' | 'edit';
  onSave: (user: User, mode: 'add' | 'edit') => void;
  onCancel: () => void;
  departmentList: Department[];
}

const boardList = ['학교', '대학', '학과', '학년', '채용', '활동', '홍보'];

export default function UserDetail({
  user,
  mode,
  onSave,
  onCancel,
  departmentList,
}: Props) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState<AdminUserResponse.affiliation>(
    AdminUserResponse.affiliation.DEPARTMENT
  );
  // 서버 enum 값 동적 추출
  const affiliationOptions = Object.values(AdminUserResponse.affiliation);
  const categoryOptions: Array<
    NonNullable<AdminUserResponse['categories']>[number]
  > = ['UNIVERSITY', 'DEPARTMENT', 'GRADE', 'RECRUIT', 'ACTIVITY', 'PROMOTION'];
  const gradeOptions: Array<NonNullable<AdminUserResponse['grades']>[number]> =
    ['ALL_YEARS', 'FIRST_YEAR', 'SECOND_YEAR', 'THIRD_YEAR', 'FOURTH_YEAR'];
  const [categories, setCategories] = useState<
    Array<
      | 'UNIVERSITY'
      | 'DEPARTMENT'
      | 'GRADE'
      | 'RECRUIT'
      | 'ACTIVITY'
      | 'PROMOTION'
    >
  >([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [grades, setGrades] = useState<
    Array<
      'ALL_YEARS' | 'FIRST_YEAR' | 'SECOND_YEAR' | 'THIRD_YEAR' | 'FOURTH_YEAR'
    >
  >([]);

  useReactEffect(() => {
    if (user && mode !== 'add') {
      setUserId(user.userId);
      setName(user.name);
      setAffiliation(user.affiliation);
      setCategories(user.categories ? user.categories : []);
      setDepartments(user.departments ?? []);
      setGrades(user.grades ? user.grades : []);
      setRegisterPassword('');
    } else {
      setUserId('');
      setPassword('');
      setRegisterPassword('');
      setName('');
      setAffiliation(AdminUserResponse.affiliation.DEPARTMENT);
      setCategories([]);
      setDepartments([]);
      setGrades([]);
    }
  }, [user, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password || !registerPassword || !name || !affiliation) {
      alert('필수 항목을 작성해주세요.');
      return;
    }
    const newUser: User = {
      id: user?.id || 0,
      userId,
      password,
      registerPassword,
      name,
      affiliation,
      categories,
      departments,
      grades,
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
            등록용 비밀번호 *
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
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
              value={affiliation}
              onChange={(e) =>
                setAffiliation(e.target.value as AdminUserResponse.affiliation)
              }
              required
              disabled={mode === 'view'}
            >
              <option value="">선택</option>
              {affiliationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label>게시판 권한 *</label>
          <div className={styles.boardCheckboxes}>
            {categoryOptions.map((cat) => (
              <div key={cat}>
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategories([...categories, cat]);
                    } else {
                      setCategories(categories.filter((c) => c !== cat));
                    }
                  }}
                  disabled={mode === 'view'}
                />
                {cat}
              </div>
            ))}
          </div>
          <FormControl fullWidth margin="dense" disabled={mode === 'view'}>
            <InputLabel id="department-multiselect-label">학과 *</InputLabel>
            <Select
              labelId="department-multiselect-label"
              multiple
              value={departments.map((d) => d.id)}
              onChange={(e) => {
                const selectedIds = e.target.value as number[];
                setDepartments(
                  departmentList.filter((d) => selectedIds.includes(d.id))
                );
              }}
              renderValue={(selected) =>
                departmentList
                  .filter((d) => selected.includes(d.id))
                  .map((d) => d.name)
                  .join(', ')
              }
            >
              {departmentList.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  <Checkbox
                    checked={departments.some((d) => d.id === dept.id)}
                  />
                  <ListItemText primary={dept.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <label>학년 *</label>
          <div className={styles.boardCheckboxes}>
            {gradeOptions.map((grade) => (
              <div key={grade}>
                <input
                  type="checkbox"
                  checked={grades.includes(grade)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setGrades([...grades, grade]);
                    } else {
                      setGrades(grades.filter((g) => g !== grade));
                    }
                  }}
                  disabled={mode === 'view'}
                />
                {grade}
              </div>
            ))}
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
