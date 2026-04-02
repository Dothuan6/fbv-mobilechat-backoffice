export interface User {
  id: string;
  stt: number;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  regType: 'Email' | 'Google' | 'SĐT' | 'Apple';
  regDate: string;
  status: 'Hoạt động' | 'Đình chỉ' | 'Chờ XN' | 'Bị cấm';
}

export interface Group {
  id: string;
  stt: number;
  avatar: string;
  name: string;
  members: number;
  createdAt: string;
  leader: string;
  status: 'Hoạt động' | 'Đã giải tán';
}

export interface Post {
  id: string;
  media: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  date: string;
  status: 'Active' | 'Pending' | 'Deleted';
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
}
