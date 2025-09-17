export interface User {
  id: string;
  userId: string;
  password: string;
  name: string;
  group: string;
  boardPermissions: string[];
  note?: string;
}

export const dummyUsers: User[] = Array.from({ length: 30 }, (_, i) => ({
  id: `u${i + 1}`,
  userId: `user${i + 1}`,
  password: `pass${1000 + i}`,
  name: `사용자${i + 1}`,
  group:
    i % 4 === 0
      ? '학생회'
      : i % 4 === 1
        ? '교직원'
        : i % 4 === 2
          ? '학년'
          : '학과',
  boardPermissions: i % 2 === 0 ? ['학교', '홍보'] : ['학과', '활동', '채용'],
  note: i % 3 === 0 ? '비고 메모 있음' : '',
}));
