import type { ReactNode } from 'react';

export interface User {
  id: string;
  stt: number;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  regType: 'Email' | 'Google' | 'SĐT' | 'Apple';
  regDate: string;
  status: 'Hoạt động' | 'Đình chỉ' | 'Chờ XÁC NHẬN' | 'Bị cấm';
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
  permissions?: string[];
  department: string;
  status: 'Active' | 'Inactive';
}

export interface AuditLog {
  id: string;
  time: string;
  admin: string;
  action: string;
  target: string;
  ip: string;
  result: 'Success' | 'Failed';
}

export interface Notification {
  id: string;
  date: string;
  title: string;
  audience: string;
  delivered: string;
  error: string;
  status: 'Sent' | 'Failed';
}

export interface MediaFile {
  id: string;
  type: 'image' | 'video';
  name: string;
  size: string;
  uploader: string;
  date: string;
  thumb: string;
}

export interface ConfigKey {
  id: string;
  key: string;
  type: 'Int' | 'Bool' | 'String';
  val: string;
  desc: string;
  date: string;
  by: string;
}

export interface Chat {
  id: string;
  type: 'Nhóm' | '1:1';
  name: string;
  info: string;
  lastMsg: string;
  time: string;
  msgCount: number;
}

export interface Interaction {
  id: string;
  user: string;
  avatar: string;
  content: string;
  postId: string;
  time: string;
  status: 'Active' | 'Flagged';
}

export interface ChartPoint {
  name: string;
  users: number;
  groups: number;
}

export type ModalConfig = {
  type?: 'danger' | 'warning' | 'info' | 'form';
  title: string;
  children?: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  wide?: boolean;
};
