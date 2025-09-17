import styles from './styles.module.css';
import { User } from './dummyUsers';

interface Props {
  users: User[];
  onSelect: (user: User) => void;
  selectedUser: User | null;
}

export default function UserList({ users, onSelect, selectedUser }: Props) {
  return (
    <div className={styles.userTable}>
      <div className={styles.headerRow}>
        <span>번호</span>
        <span>이름</span>
        <span>소속</span>
        <span>게시판 권한</span>
        <span>비고</span>
      </div>
      <ul className={styles.userList}>
        {users.map((u, idx) => (
          <li
            key={u.id}
            onClick={() => onSelect(u)}
            className={selectedUser?.id === u.id ? styles.selected : ''}
          >
            <span className={styles.userIndex}>{idx + 1}</span>
            <span className={styles.userName}>{u.name}</span>
            <span className={styles.userGroup}>{u.group}</span>
            <span className={styles.boardPermissions}>
              {u.boardPermissions.map((bp) => (
                <span key={bp} className={styles.badge}>
                  {bp}
                </span>
              ))}
            </span>
            {u.note && <span className={styles.note}>{u.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
