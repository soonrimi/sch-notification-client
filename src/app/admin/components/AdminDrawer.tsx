import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import ArticleIcon from '@mui/icons-material/Article';
import { useRouter } from 'next/navigation';

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminDrawer({ open, onClose }: AdminDrawerProps) {
  const router = useRouter();
  const menuItems = [
    { text: '관리자 계정 관리', icon: <PeopleIcon />, path: '/admin/account' },
    {
      text: '카카오 채팅방 관리',
      icon: <ChatIcon />,
      path: '/admin/kakao-chat',
    },
    { text: '게시글 목록', icon: <ArticleIcon />, path: '/admin' },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose} variant="temporary">
      <div style={{ width: 240, padding: 16 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(item.path);
                  onClose();
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
