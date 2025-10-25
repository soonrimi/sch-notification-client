'use client';
import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

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
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.5rem' }}>
            {mode === 'view'
              ? '사용자 정보'
              : mode === 'edit'
                ? '사용자 수정'
                : '새 사용자 추가'}
          </h3>
          <Stack spacing={2}>
            <TextField
              label="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={mode === 'view'}
              fullWidth
              size="small"
            />
            <TextField
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={mode === 'view'}
              fullWidth
              size="small"
            />
            <TextField
              label="등록용 비밀번호"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              disabled={mode === 'view'}
              fullWidth
              size="small"
            />
            <TextField
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={mode === 'view'}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small" disabled={mode === 'view'}>
              <InputLabel>소속</InputLabel>
              <Select
                value={affiliation}
                label="소속"
                onChange={(e) =>
                  setAffiliation(
                    e.target.value as AdminUserResponse.affiliation
                  )
                }
                required
              >
                <MenuItem value="">선택</MenuItem>
                {affiliationOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" disabled={mode === 'view'}>
              <InputLabel>학과</InputLabel>
              <Select
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
                    .filter((d) => (selected as number[]).includes(d.id))
                    .map((d) => d.name)
                    .join(', ')
                }
                label="학과"
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
            <FormControl fullWidth size="small" disabled={mode === 'view'}>
              <InputLabel>게시판 권한</InputLabel>
              <Select
                multiple
                value={categories}
                onChange={(e) => {
                  const value = e.target.value as typeof categories;
                  setCategories(value);
                }}
                renderValue={(selected) => (selected as string[]).join(', ')}
                label="게시판 권한"
              >
                {categoryOptions.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    <Checkbox checked={categories.includes(cat)} />
                    <ListItemText primary={cat} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" disabled={mode === 'view'}>
              <InputLabel>학년</InputLabel>
              <Select
                multiple
                value={grades}
                onChange={(e) => {
                  const value = e.target.value as typeof grades;
                  setGrades(value);
                }}
                renderValue={(selected) => (selected as string[]).join(', ')}
                label="학년"
              >
                {gradeOptions.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    <Checkbox checked={grades.includes(grade)} />
                    <ListItemText primary={grade} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {(mode === 'edit' || mode === 'add') && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={onCancel}
                type="button"
              >
                취소
              </Button>
            )}
            {mode !== 'view' && (
              <Button variant="contained" color="primary" type="submit">
                저장
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
    );
  }

  return <div></div>;
}
