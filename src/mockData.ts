import { User, Group, Post, Admin } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', stt: 1, avatar: 'https://i.pravatar.cc/150?u=1', name: 'Nguyễn Văn An', email: 'nguyenan@email.com', phone: '+84901234567', regType: 'Email', regDate: '01/01/2025', status: 'Hoạt động' },
  { id: '2', stt: 2, avatar: 'https://i.pravatar.cc/150?u=2', name: 'Trần Thị Bình', email: 'trinhbinh@gmail.com', phone: '+84912345678', regType: 'Google', regDate: '15/01/2025', status: 'Hoạt động' },
  { id: '3', stt: 3, avatar: 'https://i.pravatar.cc/150?u=3', name: 'Lê Văn Cường', email: 'levanc@email.com', phone: '+84923456789', regType: 'SĐT', regDate: '20/01/2025', status: 'Đình chỉ' },
  { id: '4', stt: 4, avatar: 'https://i.pravatar.cc/150?u=4', name: 'Phạm Minh Dũng', email: 'phammd@email.com', phone: '+84934567890', regType: 'Apple', regDate: '25/01/2025', status: 'Chờ XN' },
  { id: '5', stt: 5, avatar: 'https://i.pravatar.cc/150?u=5', name: 'Hoàng Thị Em', email: 'hte@gmail.com', phone: '+84945678901', regType: 'Email', regDate: '01/02/2025', status: 'Hoạt động' },
];

export const MOCK_GROUPS: Group[] = [
  { id: '1', stt: 1, avatar: 'FBV', name: '[GR] Team Thiết kế FBV', members: 28, createdAt: '10/01/2025', leader: 'Nguyễn Văn An', status: 'Hoạt động' },
  { id: '2', stt: 2, avatar: 'https://picsum.photos/seed/group2/100', name: '[GR] Nhóm Marketing Q1', members: 15, createdAt: '15/01/2025', leader: 'Trần Thị Bình', status: 'Hoạt động' },
  { id: '3', stt: 3, avatar: 'https://picsum.photos/seed/group3/100', name: '[GR] Backend Dev Squad', members: 8, createdAt: '20/01/2025', leader: 'Lê Văn Cường', status: 'Hoạt động' },
  { id: '4', stt: 4, avatar: 'https://picsum.photos/seed/group4/100', name: '[GR] Nhóm vi phạm #1', members: 52, createdAt: '01/02/2025', leader: '[Đã xóa]', status: 'Đã giải tán' },
];

export const MOCK_POSTS: Post[] = [
  { id: '1', media: 'https://picsum.photos/seed/post1/200', content: '[Img] Chia sẻ khoảnh khắc hôm nay với mọi người nhé! #FBV', author: 'Nguyễn Văn An', likes: 24, comments: 5, date: '01/04/2026', status: 'Active' },
  { id: '2', media: 'https://picsum.photos/seed/post2/200', content: '[Img] Chia sẻ khoảnh khắc hôm nay...', author: 'Nguyễn Văn An', likes: 13, comments: 5, date: '01/04/2026', status: 'Pending' },
  { id: '3', media: 'https://picsum.photos/seed/post3/200', content: '[Img] Chia sẻ khoảnh khắc hôm nay...', author: 'Nguyễn Văn An', likes: 24, comments: 5, date: '01/04/2026', status: 'Active' },
];

export const MOCK_ADMINS: Admin[] = [
  { id: '1', name: 'Nguyễn Văn An', email: 'an@fbv.app', role: 'Super Admin', department: 'Technology', status: 'Active' },
  { id: '2', name: 'Trần Thị Bình', email: 'binh@fbv.app', role: 'Admin', department: 'Business', status: 'Active' },
  { id: '3', name: 'Lê Văn Cường', email: 'cuong@fbv.app', role: 'Moderator', department: 'Content', status: 'Active' },
];
