import { User, Group, Post, Admin } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', stt: 1, avatar: 'https://i.pravatar.cc/150?u=1', name: 'Nguyễn Văn An', email: 'nguyenan@email.com', phone: '+84901234567', regType: 'Email', regDate: '01/01/2025', status: 'Hoạt động' },
  { id: '2', stt: 2, avatar: 'https://i.pravatar.cc/150?u=2', name: 'Trần Thị Bình', email: 'trinhbinh@gmail.com', phone: '+84912345678', regType: 'Google', regDate: '15/01/2025', status: 'Hoạt động' },
  { id: '3', stt: 3, avatar: 'https://i.pravatar.cc/150?u=3', name: 'Lê Văn Cường', email: 'levanc@email.com', phone: '+84923456789', regType: 'SĐT', regDate: '20/01/2025', status: 'Đình chỉ' },
  { id: '4', stt: 4, avatar: 'https://i.pravatar.cc/150?u=4', name: 'Phạm Minh Dũng', email: 'phammd@email.com', phone: '+84934567890', regType: 'Apple', regDate: '25/01/2025', status: 'Chờ XÁC NHẬN' },
  { id: '5', stt: 5, avatar: 'https://i.pravatar.cc/150?u=5', name: 'Hoàng Thị Em', email: 'hte@gmail.com', phone: '+84945678901', regType: 'Email', regDate: '01/02/2025', status: 'Hoạt động' },
  { id: '6', stt: 6, avatar: 'https://i.pravatar.cc/150?u=6', name: 'Võ Thị Phượng', email: 'phuong@email.com', phone: '+84956789012', regType: 'Google', regDate: '10/02/2025', status: 'Bị cấm' },
  { id: '7', stt: 7, avatar: 'https://i.pravatar.cc/150?u=7', name: 'Đinh Văn Quân', email: 'quan@fbv.app', phone: '+84967890123', regType: 'SĐT', regDate: '15/02/2025', status: 'Hoạt động' },
  { id: '8', stt: 8, avatar: 'https://i.pravatar.cc/150?u=8', name: 'Bùi Thị Hoa', email: 'hoabui@gmail.com', phone: '+84978901234', regType: 'Apple', regDate: '20/02/2025', status: 'Hoạt động' },
  { id: '9', stt: 9, avatar: 'https://i.pravatar.cc/150?u=9', name: 'Trương Văn Minh', email: 'minh.truong@email.com', phone: '+84989012345', regType: 'Email', regDate: '28/02/2025', status: 'Chờ XÁC NHẬN' },
  { id: '10', stt: 10, avatar: 'https://i.pravatar.cc/150?u=10', name: 'Lý Thị Lan', email: 'lan.ly@gmail.com', phone: '+84990123456', regType: 'Google', regDate: '05/03/2025', status: 'Hoạt động' },
];

export const MOCK_GROUPS: Group[] = [
  { id: '1', stt: 1, avatar: 'FBV', name: '[GR] Team Thiết kế FBV', members: 28, createdAt: '10/01/2025', leader: 'Nguyễn Văn An', status: 'Hoạt động' },
  { id: '2', stt: 2, avatar: 'https://picsum.photos/seed/group2/100', name: '[GR] Nhóm Marketing Q1', members: 15, createdAt: '15/01/2025', leader: 'Trần Thị Bình', status: 'Hoạt động' },
  { id: '3', stt: 3, avatar: 'https://picsum.photos/seed/group3/100', name: '[GR] Backend Dev Squad', members: 8, createdAt: '20/01/2025', leader: 'Lê Văn Cường', status: 'Hoạt động' },
  { id: '4', stt: 4, avatar: 'https://picsum.photos/seed/group4/100', name: '[GR] Nhóm vi phạm #1', members: 52, createdAt: '01/02/2025', leader: '[Đã xóa]', status: 'Đã giải tán' },
  { id: '5', stt: 5, avatar: 'https://picsum.photos/seed/group5/100', name: '[GR] FBV Community Hub', members: 312, createdAt: '05/02/2025', leader: 'Hoàng Thị Em', status: 'Hoạt động' },
  { id: '6', stt: 6, avatar: 'https://picsum.photos/seed/group6/100', name: '[GR] Sale Team Q1 2025', members: 18, createdAt: '10/02/2025', leader: 'Phạm Minh Dũng', status: 'Hoạt động' },
];

export const MOCK_POSTS: Post[] = [
  { id: '1', media: 'https://picsum.photos/seed/post1/200', content: '[Img] Chia sẻ khoảnh khắc hôm nay với mọi người nhé! #FBV', author: 'Nguyễn Văn An', likes: 24, comments: 5, date: '01/04/2026', status: 'Active' },
  { id: '2', media: 'https://picsum.photos/seed/post2/200', content: '[Img] Chia sẻ khoảnh khắc hôm nay — đây là nội dung có thể vi phạm cộng đồng...', author: 'Nguyễn Văn An', likes: 13, comments: 5, date: '01/04/2026', status: 'Pending' },
  { id: '3', media: 'https://picsum.photos/seed/post3/200', content: '[Img] Chia sẻ khoảnh khắc hôm nay với mọi người nhé!', author: 'Trần Thị Bình', likes: 24, comments: 5, date: '31/03/2026', status: 'Active' },
  { id: '4', media: 'https://picsum.photos/seed/post4/200', content: '[Video] Review sản phẩm mới nhất từ FBV — rất đáng mua!', author: 'Lê Văn Cường', likes: 88, comments: 21, date: '30/03/2026', status: 'Deleted' },
  { id: '5', media: 'https://picsum.photos/seed/post5/200', content: '[Img] Sự kiện cuối tuần tại văn phòng FBV #team #culture', author: 'Hoàng Thị Em', likes: 156, comments: 43, date: '29/03/2026', status: 'Active' },
  { id: '6', media: 'https://picsum.photos/seed/post6/200', content: '[Img] Nội dung không phù hợp đã bị gắn cờ bởi hệ thống.', author: 'Phạm Minh Dũng', likes: 2, comments: 1, date: '28/03/2026', status: 'Pending' },
];

export const MOCK_ADMINS: Admin[] = [
  { id: '1', name: 'Nguyễn Văn An', email: 'an@fbv.app', role: 'Super Admin', department: 'Technology', status: 'Active', permissions: ['dashboard', 'users', 'groups', 'posts', 'chats', 'notifications', 'audit', 'config', 'rbac', 'media', 'settings', 'branding'] },
  { id: '2', name: 'Trần Thị Bình', email: 'binh@fbv.app', role: 'Admin', department: 'Business', status: 'Active', permissions: ['dashboard', 'users', 'groups', 'posts', 'chats', 'notifications', 'media'] },
  { id: '3', name: 'Lê Văn Cường', email: 'cuong@fbv.app', role: 'Moderator', department: 'Content', status: 'Active', permissions: ['dashboard', 'posts', 'chats', 'media'] },
  { id: '4', name: 'Phạm Thị Duyên', email: 'duyen@fbv.app', role: 'Content Manager', department: 'Marketing', status: 'Inactive', permissions: ['dashboard', 'posts', 'notifications'] },
  { id: '5', name: 'Hoàng Minh Tú', email: 'tu@fbv.app', role: 'Viewer', department: 'QA', status: 'Active', permissions: ['dashboard', 'audit'] },
];

export const CHART_DATA_7DAYS = [
  { name: '26/3', users: 18, groups: 3 },
  { name: '27/3', users: 24, groups: 5 },
  { name: '28/3', users: 31, groups: 2 },
  { name: '29/3', users: 19, groups: 8 },
  { name: '30/3', users: 27, groups: 4 },
  { name: '31/3', users: 35, groups: 6 },
  { name: '1/4', users: 42, groups: 9 },
];

export const CHART_DATA_30DAYS = [
  { name: '3/3', users: 12, groups: 2 },
  { name: '7/3', users: 19, groups: 4 },
  { name: '11/3', users: 25, groups: 3 },
  { name: '15/3', users: 22, groups: 7 },
  { name: '19/3', users: 30, groups: 5 },
  { name: '23/3', users: 28, groups: 6 },
  { name: '27/3', users: 35, groups: 8 },
  { name: '1/4', users: 42, groups: 9 },
];

export const MOCK_AUDIT_LOGS = [
  { id: '1', time: '02/04/2026 10:30', admin: 'admin@fbv.app', action: 'Update Config', target: 'auth.otp_expiry_sec', ip: '103.21.244.10', result: 'Success' },
  { id: '2', time: '02/04/2026 10:15', admin: 'superadmin@fbv', action: 'Suspend User', target: 'user_992 (Lê Văn Cường)', ip: '103.21.244.10', result: 'Success' },
  { id: '3', time: '02/04/2026 09:58', admin: 'content_mgr@fbv.app', action: 'Delete Post', target: 'post_456', ip: '27.72.111.50', result: 'Success' },
  { id: '4', time: '01/04/2026 18:30', admin: 'admin@fbv.app', action: 'Send Notification', target: 'All users (12,483)', ip: '103.21.244.10', result: 'Success' },
  { id: '5', time: '01/04/2026 16:00', admin: 'binh@fbv.app', action: 'Create Admin', target: 'tu@fbv.app (Viewer)', ip: '45.30.14.22', result: 'Success' },
  { id: '6', time: '01/04/2026 14:20', admin: 'superadmin@fbv', action: 'Dissolve Group', target: '[GR] Nhóm vi phạm #1', ip: '103.21.244.10', result: 'Success' },
  { id: '7', time: '01/04/2026 11:00', admin: 'content_mgr@fbv.app', action: 'Delete Media', target: 'IMG_bad_content.jpg', ip: '27.72.111.50', result: 'Failed' },
  { id: '8', time: '01/04/2026 09:00', admin: 'admin@fbv.app', action: 'Update Branding', target: 'App Logo (logo_v3.png)', ip: '103.21.244.10', result: 'Success' },
];

export const MOCK_NOTIFICATIONS = [
  { id: '1', date: '01/04 09:00', title: 'Chào mừng tháng 4!', audience: 'Tất cả (12,483)', delivered: '12,321', error: '162', status: 'Sent' },
  { id: '2', date: '30/03 12:00', title: 'Thông báo bảo trì hệ thống', audience: 'Cụ thể (1 người)', delivered: '1', error: '0', status: 'Sent' },
  { id: '3', date: '30/03 08:00', title: 'Cập nhật tính năng mới v2.1', audience: 'Tất cả (12,483)', delivered: '12,390', error: '93', status: 'Sent' },
  { id: '4', date: '29/03 15:30', title: 'Khuyến mãi cuối tuần', audience: 'Tất cả (12,483)', delivered: '0', error: '12,483', status: 'Failed' },
];

export const MOCK_MEDIA = [
  { id: '1', type: 'image', name: 'team-meeting-Jan15.jpg', size: '2.4 MB', uploader: 'Nguyễn Văn An', date: '15/01/2026 10:30', thumb: 'https://picsum.photos/seed/media1/200' },
  { id: '2', type: 'video', name: 'product-demo-v2.mp4', size: '45.2 MB', uploader: 'Trần Thị Bình', date: '14/01/2026 15:45', thumb: 'https://picsum.photos/seed/media2/200' },
  { id: '3', type: 'image', name: 'logo_white_transparent.png', size: '0.3 MB', uploader: 'admin@fbv.app', date: '14/01/2026 10:30', thumb: 'https://picsum.photos/seed/media3/200' },
  { id: '4', type: 'image', name: 'event-photo-march.jpg', size: '3.1 MB', uploader: 'Hoàng Thị Em', date: '28/03/2026 09:15', thumb: 'https://picsum.photos/seed/media4/200' },
  { id: '5', type: 'video', name: 'tutorial-onboarding.mp4', size: '128.5 MB', uploader: 'content_mgr@fbv.app', date: '20/03/2026 14:00', thumb: 'https://picsum.photos/seed/media5/200' },
  { id: '6', type: 'image', name: 'banner-april-promo.jpg', size: '1.8 MB', uploader: 'binh@fbv.app', date: '01/04/2026 08:00', thumb: 'https://picsum.photos/seed/media6/200' },
];

export const CONFIG_KEYS = [
  { id: '1', key: 'auth.otp_expiry_sec', type: 'Int', val: '300', desc: 'Thời gian hết hạn OTP (giây)', date: '01/04/2026 10:30', by: 'admin@fbv.app' },
  { id: '2', key: 'auth.otp_resend_cooldown', type: 'Int', val: '60', desc: 'Thời gian chờ gửi lại OTP (giây)', date: '15/03/2026 14:00', by: 'superadmin@fbv' },
  { id: '3', key: 'feed.page_size', type: 'Int', val: '20', desc: 'Số bài viết mỗi trang feed', date: '10/03/2026 09:00', by: 'content_mgr@fbv.app' },
  { id: '4', key: 'chat.max_message_length', type: 'Int', val: '2000', desc: 'Độ dài tối đa tin nhắn (ký tự)', date: '05/03/2026 11:00', by: 'admin@fbv.app' },
  { id: '5', key: 'media.max_file_size_mb', type: 'Int', val: '50', desc: 'Dung lượng file tải lên tối đa (MB)', date: '01/03/2026 08:30', by: 'superadmin@fbv' },
  { id: '6', key: 'feature.story_enabled', type: 'Bool', val: 'true', desc: 'Bật/tắt tính năng Story', date: '20/02/2026 16:00', by: 'admin@fbv.app' },
];

export const MOCK_CHATS = [
  { id: '1', type: 'Nhóm', name: 'Backend Dev Squad', info: '8 thành viên', lastMsg: 'Ai review PR #142 chưa?', time: '09:45', msgCount: 234 },
  { id: '2', type: '1:1', name: 'Nguyễn Văn An → Trần Thị Bình', info: 'Trực tiếp', lastMsg: 'Xong rồi bạn ơi, check lại nhé!', time: '09:30', msgCount: 87 },
  { id: '3', type: 'Nhóm', name: '[GR] Team Thiết kế FBV', info: '28 thành viên', lastMsg: 'Design system v3 đã upload lên drive', time: '09:15', msgCount: 512 },
  { id: '4', type: '1:1', name: 'Lê Văn Cường → Admin', info: 'Trực tiếp', lastMsg: 'Tại sao tài khoản tôi bị khoá?', time: '08:55', msgCount: 12 },
  { id: '5', type: 'Nhóm', name: 'FBV Community Hub', info: '312 thành viên', lastMsg: 'Sự kiện offline tháng 4 tại HN 🎉', time: '08:30', msgCount: 1893 },
  { id: '6', type: '1:1', name: 'Phạm Minh Dũng → Hoàng Thị Em', info: 'Trực tiếp', lastMsg: 'Oke mình gặp lúc 2pm nhé', time: '08:00', msgCount: 45 },
];

export const MOCK_INTERACTIONS = [
  { id: '1', user: 'Nguyễn Văn An', avatar: 'https://i.pravatar.cc/150?u=1', content: 'Bài viết rất hay và ý nghĩa! Cảm ơn bạn đã chia sẻ.', postId: 'post_123', time: '09:30 01/04', status: 'Active' },
  { id: '2', user: 'Trần Thị Bình', avatar: 'https://i.pravatar.cc/150?u=2', content: 'Cảm ơn bạn đã chia sẻ, mình cũng nghĩ vậy.', postId: 'post_456', time: '09:15 01/04', status: 'Active' },
  { id: '3', user: 'Lê Văn Cường', avatar: 'https://i.pravatar.cc/150?u=3', content: 'Nội dung không phù hợp, cần kiểm tra lại.', postId: 'post_789', time: '08:45 01/04', status: 'Flagged' },
  { id: '4', user: 'Phạm Minh Dũng', avatar: 'https://i.pravatar.cc/150?u=4', content: 'Hay quá! Share ngay cho mọi người biết.', postId: 'post_321', time: '08:20 01/04', status: 'Active' },
  { id: '5', user: 'Võ Thị Phượng', avatar: 'https://i.pravatar.cc/150?u=6', content: 'Spam spam spam mua ngay đi mọi người!!!', postId: 'post_654', time: '07:55 01/04', status: 'Flagged' },
];
