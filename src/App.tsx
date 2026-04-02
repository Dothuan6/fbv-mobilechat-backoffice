import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  MessageSquare, 
  FileText, 
  Settings, 
  Bell, 
  ShieldCheck, 
  Image as ImageIcon, 
  ChevronDown, 
  LogOut,
  Search,
  RefreshCw,
  Filter,
  Plus,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { MOCK_USERS, MOCK_GROUPS, MOCK_POSTS, MOCK_ADMINS, CHART_DATA_7DAYS, CHART_DATA_30DAYS, MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS, MOCK_MEDIA, CONFIG_KEYS, MOCK_CHATS, MOCK_INTERACTIONS } from './mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, subItems }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button
        onClick={() => {
          if (subItems) setIsOpen(!isOpen);
          onClick();
        }}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors",
          active ? "bg-[#2563eb] text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          <span>{label}</span>
        </div>
        {subItems && (
          <ChevronDown 
            size={14} 
            className={cn("transition-transform", isOpen && "rotate-180")} 
          />
        )}
      </button>
      {subItems && isOpen && (
        <div className="bg-slate-900/50">
          {subItems.map((item: any) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center pl-11 pr-4 py-2 text-xs transition-colors",
                item.active ? "text-white font-medium" : "text-slate-500 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, trend, color, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
        <p className={cn("text-xs mt-2 font-medium", trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
          {trend} hôm nay
        </p>
      </div>
      <div className={cn("p-3 rounded-lg", color)}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Badge = ({ children, variant }: any) => {
  const variants: any = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    deleted: "bg-rose-100 text-rose-700",
    suspended: "bg-slate-100 text-slate-700",
    inactive: "bg-slate-100 text-slate-700",
    failed: "bg-rose-100 text-rose-700",
    sent: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant?.toLowerCase()] || variants.suspended)}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children, confirmLabel, onConfirm, type = 'danger', wide = false }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("bg-white rounded-xl shadow-2xl w-full mx-auto overflow-hidden", wide ? "max-w-2xl px-2" : "max-w-md")}
      >
        <div className={cn("p-6", type !== 'form' && "text-center")}>
          {type !== 'form' && (
            <div className="flex justify-center mb-4">
              <div className={cn("p-3 rounded-full", type === 'danger' ? "bg-rose-100 text-rose-600" : type === 'info' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600")}>
                {type === 'info' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
              </div>
            </div>
          )}
          <h3 className={cn("text-lg font-bold mb-2", type === 'form' && "border-b border-slate-100 pb-4 mb-4")}>{title}</h3>
          <div className={cn("text-slate-500 text-sm mb-6", type === 'form' && "text-left")}>{children}</div>
          <div className={cn("flex gap-3", type === 'form' ? "justify-end pt-4 border-t border-slate-100" : "justify-center")}>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={() => { if(onConfirm) onConfirm(); onClose(); }}
              className={cn("px-6 py-2 text-white rounded-lg font-medium transition-colors", type === 'danger' ? "bg-rose-500 hover:bg-rose-600" : "bg-blue-500 hover:bg-blue-600")}
            >
              {confirmLabel || 'Xác nhận'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<any>({});

  const openModal = (config: any) => {
    setModalConfig(config);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setViewMode('list');
    setSelectedItem(null);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                label="Tổng người dùng đã đăng ký" 
                value="12,483" 
                trend="+142" 
                color="bg-blue-500" 
                icon={Users} 
              />
              <StatCard 
                label="Tổng nhóm đã tạo" 
                value="3,291" 
                trend="+25" 
                color="bg-emerald-500" 
                icon={MessageSquare} 
              />
              <StatCard 
                label="Người dùng bị khóa" 
                value="47" 
                trend="+3" 
                color="bg-rose-500" 
                icon={ShieldCheck} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold">Người dùng đăng ký mới theo ngày</h4>
                  <div className="flex gap-2 text-xs">
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md font-medium">[ 7 ngày ]</button>
                    <button className="px-3 py-1 text-slate-500 hover:bg-slate-50 rounded-md">[ 30 ngày ]</button>
                    <button className="px-3 py-1 text-slate-500 hover:bg-slate-50 rounded-md">[ Tùy chỉnh ]</button>
                  </div>
                </div>
                <div className="h-64 pt-4 pb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA_7DAYS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold">Nhóm được tạo theo ngày</h4>
                </div>
                <div className="h-64 pt-4 pb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA_7DAYS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="groups" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-bold">Hoạt động gần đây</h4>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Thời gian</th>
                    <th className="px-6 py-3 text-left font-medium">Admin</th>
                    <th className="px-6 py-3 text-left font-medium">Hành động</th>
                    <th className="px-6 py-3 text-left font-medium">Đối tượng</th>
                    <th className="px-6 py-3 text-left font-medium">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { time: '09:41:23', admin: 'admin@fbv', action: 'suspend_user', target: 'user_1234', result: 'Hoạt động' },
                    { time: '09:38:10', admin: 'cs@fbv.app', action: 'delete_post', target: 'post_5678', result: 'Hoạt động' },
                    { time: '09:30:05', admin: 'admin@fbv', action: 'update_config', target: 'feed.page_size', result: 'Hoạt động' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">{row.time}</td>
                      <td className="px-6 py-4 font-medium">{row.admin}</td>
                      <td className="px-6 py-4 text-slate-600">{row.action}</td>
                      <td className="px-6 py-4 text-slate-600">{row.target}</td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">{row.result}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'users':
        if (viewMode === 'detail') {
          return (
            <div className="space-y-6">
              <button 
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" /> Back to list
              </button>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                  <div className="flex items-center gap-6">
                    <img src={selectedItem?.avatar} alt="" className="w-20 h-20 rounded-full border-4 border-slate-50" />
                    <div>
                      <h4 className="text-2xl font-bold">{selectedItem?.name}</h4>
                      <Badge variant="active">Active</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Agora UID</p>
                    <p className="text-sm font-bold">uid_78231</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Logged-in Devices</p>
                    <p className="text-sm font-bold">3 thiết bị</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Last Login</p>
                    <p className="text-sm font-bold">Hôm nay 09:30</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Total Posts</p>
                    <p className="text-sm font-bold">24</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Birthday</p>
                    <p className="text-sm font-bold">15/06/1995</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Email</p>
                    <p className="text-sm font-bold">{selectedItem?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Phone</p>
                    <p className="text-sm font-bold">{selectedItem?.phone}</p>
                  </div>
                </div>
                <div className="px-8 pb-8 flex flex-col md:flex-row gap-3">
                  <button 
                    onClick={() => openModal({
                      title: 'Đình chỉ tài khoản?',
                      children: `Bạn có chắc muốn đình chỉ tài khoản ${selectedItem?.name}? Người dùng sẽ không thể đăng nhập.`,
                      confirmLabel: 'Đình chỉ',
                      type: 'danger',
                      onConfirm: () => console.log('Suspended')
                    })}
                    className="flex-1 py-2.5 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600 transition-colors"
                  >
                    Đình chỉ tài khoản
                  </button>
                  <button 
                    onClick={() => openModal({
                      title: 'Xác thực thủ công',
                      children: `Xác nhận tài khoản ${selectedItem?.name} hợp lệ?`,
                      confirmLabel: 'Xác nhận',
                      type: 'info',
                      onConfirm: () => console.log('Verified')
                    })}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Xác thực thủ công
                  </button>
                  <button 
                    onClick={() => openModal({
                      title: 'Cập nhật thông tin',
                      type: 'form',
                      children: (
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Tên người dùng</label>
                            <input type="text" defaultValue={selectedItem?.name} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
                            <input type="email" defaultValue={selectedItem?.email} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>
                          <div>
                           <label className="text-sm font-medium text-slate-700 block mb-1">Trạng thái</label>
                           <select defaultValue={selectedItem?.status} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none">
                             <option value="Hoạt động">Hoạt động</option>
                             <option value="Đình chỉ">Đình chỉ</option>
                             <option value="Chờ XN">Chờ XN</option>
                           </select>
                          </div>
                        </div>
                      ),
                      confirmLabel: 'Lưu thay đổi',
                      onConfirm: () => console.log('Updated info')
                    })}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    Cập nhật thông tin
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h5 className="font-bold">Login Device List</h5>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Device Name</th>
                      <th className="px-6 py-3 text-left font-bold">Location</th>
                      <th className="px-6 py-3 text-left font-bold">Last Login Time</th>
                      <th className="px-6 py-3 text-left font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'iPhone 16 Pro Max', loc: 'Ho Chi Minh', time: '09:30 20/03/2025' },
                      { name: 'iPhone 15 Pro Max', loc: 'Ho Chi Minh', time: '09:30 19/03/2025' },
                      { name: 'iPhone XS Max', loc: 'Ho Chi Minh', time: '09:30 18/03/2025' },
                    ].map((device, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{device.name}</td>
                        <td className="px-6 py-4 text-slate-600">{device.loc}</td>
                        <td className="px-6 py-4 text-slate-600">{device.time}</td>
                        <td 
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal({
                              title: 'Đăng xuất thiết bị',
                              children: `Bạn có chắc muốn đăng xuất tài khoản khỏi thiết bị ${device.name}?`,
                              confirmLabel: 'Đăng xuất',
                              type: 'danger',
                              onConfirm: () => console.log('Logged out device')
                            });
                          }}
                          className="px-6 py-4 text-rose-500 font-bold cursor-pointer hover:underline"
                        >
                          [Đăng xuất]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xl">Quản lý Người dùng</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openModal({
                      title: 'Tạo tài khoản mới',
                      type: 'form',
                      children: (
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Tên người dùng</label>
                            <input type="text" placeholder="Nhập tên" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
                            <input type="email" placeholder="Nhập email" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Số điện thoại</label>
                            <input type="text" placeholder="Nhập SĐT" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Mật khẩu</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>
                        </div>
                      ),
                      confirmLabel: 'Tạo mới',
                      onConfirm: () => console.log('Created user')
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                  >
                    <Plus size={16} />
                    Tạo mới
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm">
                  <span className="text-slate-500">Trạng thái:</span>
                  <div className="flex items-center gap-1 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Tất cả
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm">
                  <span className="text-slate-500">Loại ĐK:</span>
                  <div className="flex items-center gap-1 font-medium">
                    Tất cả
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Tìm theo tên / email / SĐT..." 
                    className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium">
                  <Download size={16} />
                  Xuất CSV
                </button>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">STT</th>
                  <th className="px-6 py-3 text-left font-bold">Avatar</th>
                  <th className="px-6 py-3 text-left font-bold">Tên người dùng</th>
                  <th className="px-6 py-3 text-left font-bold">Email</th>
                  <th className="px-6 py-3 text-left font-bold">Số điện thoại</th>
                  <th className="px-6 py-3 text-left font-bold">Loại ĐK</th>
                  <th className="px-6 py-3 text-left font-bold">Ngày ĐK</th>
                  <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_USERS.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => { setSelectedItem(user); setViewMode('detail'); }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">{user.stt}</td>
                    <td className="px-6 py-4">
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 group-hover:text-blue-600">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{user.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{user.regType}</td>
                    <td className="px-6 py-4 text-slate-600">{user.regDate}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        user.status === 'Hoạt động' ? 'active' : 
                        user.status === 'Chờ XN' ? 'pending' : 
                        user.status === 'Đình chỉ' ? 'suspended' : 'deleted'
                      }>
                        {user.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
              <p className="text-xs text-slate-500">Hiển thị 1-10 / 248 kết quả</p>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white">{'<'}</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-white">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-white">3</button>
                <span className="px-2 self-center text-slate-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white">{'>'}</button>
              </div>
            </div>
            <div className="bg-amber-50 p-3 text-xs text-amber-700 font-medium">
              Click vào dòng để xem thao tác: <span className="text-blue-600 underline cursor-pointer">Xem chi tiết</span>
            </div>
          </div>
        );
      case 'branding':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h4 className="text-2xl font-bold mb-1">App Branding & Basic Settings</h4>
              <p className="text-slate-500 text-sm mb-8">Manage the application name and visual identity.</p>
              
              <div className="space-y-8">
                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">BASIC SETTINGS</h5>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Application Name:</label>
                    <input 
                      type="text" 
                      defaultValue="FBV MobileChat" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </section>

                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">LOGO MANAGEMENT</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-slate-100 rounded-xl p-6 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">CURRENT LOGO</p>
                      <div className="w-32 h-32 bg-[#1e293b] rounded-xl mx-auto flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-3xl">FBV</span>
                      </div>
                      <p className="text-sm font-medium">FBV 192x192 px</p>
                      <p className="text-xs text-slate-400">[ Logo currently active ]</p>
                    </div>
                    
                    <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">UPLOAD NEW LOGO</p>
                      <div className="w-12 h-12 text-slate-300 mb-4">
                        <Download size={48} strokeWidth={1} />
                      </div>
                      <p className="text-sm text-slate-600 mb-1">Drop PNG/SVG file here to upload</p>
                      <p className="text-[10px] text-slate-400 mb-4">Recommended size: 512x512 px, transparent background</p>
                      <button className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-medium hover:bg-white transition-colors">
                        [ Choose File ]
                      </button>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-6 text-center bg-slate-50/30">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">NEW LOGO PREVIEW</p>
                      <div className="w-32 h-32 bg-slate-200 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <ImageIcon size={48} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-400">[ Logo preview before saving ]</p>
                      <p className="text-xs text-slate-400">Will be active after upload and save</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">SETTINGS CHANGE HISTORY</h5>
                  <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-6 py-3 text-left font-medium">Date & Time</th>
                          <th className="px-6 py-3 text-left font-medium">Admin</th>
                          <th className="px-6 py-3 text-left font-medium">Changed Field</th>
                          <th className="px-6 py-3 text-left font-medium">Old Value</th>
                          <th className="px-6 py-3 text-left font-medium">New Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-6 py-4">15/03/2024 14:00</td>
                          <td className="px-6 py-4">superadmin@fbv</td>
                          <td className="px-6 py-4">Logo</td>
                          <td className="px-6 py-4">logo_v1.png</td>
                          <td className="px-6 py-4">logo_v2.png</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4">10/03/2024 09:30</td>
                          <td className="px-6 py-4">admin@fbv</td>
                          <td className="px-6 py-4">Application Name</td>
                          <td className="px-6 py-4">FBV Chat</td>
                          <td className="px-6 py-4">FBV MobileChat</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-6 py-2 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors">Cancel</button>
              <button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">Save Changes</button>
            </div>
          </div>
        );
      case 'groups':
        if (viewMode === 'detail') {
          return (
            <div className="space-y-6">
              <button 
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" /> Back to list
              </button>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                  <div className="flex items-center gap-6">
                    {selectedItem?.avatar === 'FBV' ? (
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-slate-50">FBV</div>
                    ) : (
                      <img src={selectedItem?.avatar} alt="" className="w-20 h-20 rounded-full border-4 border-slate-50 object-cover" />
                    )}
                    <div>
                      <h4 className="text-2xl font-bold">{selectedItem?.name}</h4>
                      <Badge variant="active">Active</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Group ID</p>
                    <p className="text-sm font-bold">grp_9921</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Members</p>
                    <p className="text-sm font-bold">{selectedItem?.members} thành viên</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Creation Date</p>
                    <p className="text-sm font-bold">{selectedItem?.createdAt}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Leader</p>
                    <p className="text-sm font-bold">{selectedItem?.leader}</p>
                  </div>
                </div>
                <div className="px-8 pb-8 flex flex-col md:flex-row gap-3">
                  <button 
                    onClick={() => openModal({
                      title: 'Giải tán nhóm?',
                      children: `Bạn có chắc muốn giải tán nhóm ${selectedItem?.name}? Mọi dữ liệu và thành viên trong nhóm sẽ bị xóa và không thể khôi phục.`,
                      confirmLabel: 'Giải tán',
                      type: 'danger',
                      onConfirm: () => console.log('Dissolved group')
                    })}
                    className="flex-1 py-2.5 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600 transition-colors"
                  >
                    Giải tán nhóm
                  </button>
                  <button 
                    onClick={() => openModal({
                      title: 'Quản lý thành viên',
                      type: 'form',
                      children: (
                        <div className="space-y-4 pt-2">
                          <p className="text-sm text-slate-500 mb-4">Thêm thành viên mới vào nhóm: <span className="font-bold text-slate-800">{selectedItem?.name}</span></p>
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Email hoặc Số điện thoại</label>
                            <input type="text" placeholder="Nhập email hoặc SĐT người dùng" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>
                          <div>
                           <label className="text-sm font-medium text-slate-700 block mb-1">Vai trò</label>
                           <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none">
                             <option value="member">Thành viên</option>
                             <option value="admin">Quản trị viên</option>
                           </select>
                          </div>
                        </div>
                      ),
                      confirmLabel: 'Thêm thành viên',
                      onConfirm: () => console.log('Added member')
                    })}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    Quản lý thành viên
                  </button>
                  <button className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors">Xem lịch sử</button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h5 className="font-bold">Member List</h5>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">User</th>
                      <th className="px-6 py-3 text-left font-bold">Role</th>
                      <th className="px-6 py-3 text-left font-bold">Joined Date</th>
                      <th className="px-6 py-3 text-left font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'Nguyễn Văn An', role: 'Leader', date: '01/01/2024' },
                      { name: 'Trần Thị Bình', role: 'Member', date: '05/01/2024' },
                      { name: 'Lê Văn Cường', role: 'Member', date: '10/01/2024' },
                    ].map((member, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{member.name}</td>
                        <td className="px-6 py-4">
                          <Badge variant={member.role === 'Leader' ? 'active' : 'pending'}>{member.role}</Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{member.date}</td>
                        <td 
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal({
                              title: 'Xóa thành viên',
                              children: `Bạn có chắc muốn xóa ${member.name} khỏi nhóm này?`,
                              confirmLabel: 'Xóa',
                              type: 'danger',
                              onConfirm: () => console.log('Removed member')
                            });
                          }}
                          className="px-6 py-4 text-rose-500 font-bold cursor-pointer hover:underline"
                        >
                          [Xóa]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xl">Quản lý Nhóm</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openModal({
                      title: 'Tạo nhóm mới',
                      type: 'form',
                      children: (
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Tên nhóm</label>
                            <input type="text" placeholder="Nhập tên nhóm" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Mô tả</label>
                            <textarea placeholder="Nhập mô tả nhóm" rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none resize-none"></textarea>
                          </div>
                          <div>
                           <label className="text-sm font-medium text-slate-700 block mb-1">Loại nhóm</label>
                           <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none">
                             <option value="public">Công khai</option>
                             <option value="private">Riêng tư</option>
                           </select>
                          </div>
                        </div>
                      ),
                      confirmLabel: 'Tạo nhóm',
                      onConfirm: () => console.log('Created group')
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    <Plus size={16} />
                    Tạo nhóm mới
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium">
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium">
                    <Filter size={16} />
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm">
                  <span className="text-slate-500">Trạng thái:</span>
                  <div className="flex items-center gap-1 font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Tất cả
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Tìm kiếm theo tên nhóm..." className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-[#1e293b] text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">STT</th>
                  <th className="px-6 py-3 text-left font-bold">Avatar</th>
                  <th className="px-6 py-3 text-left font-bold">Tên nhóm</th>
                  <th className="px-6 py-3 text-left font-bold">Số thành viên</th>
                  <th className="px-6 py-3 text-left font-bold">Ngày tạo</th>
                  <th className="px-6 py-3 text-left font-bold">Trưởng nhóm</th>
                  <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_GROUPS.map((group) => (
                  <tr 
                    key={group.id} 
                    onClick={() => { setSelectedItem(group); setViewMode('detail'); }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">{group.stt}</td>
                    <td className="px-6 py-4">
                      {group.avatar === 'FBV' ? (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">FBV</div>
                      ) : (
                        <img src={group.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium group-hover:text-blue-600">{group.name}</td>
                    <td className="px-6 py-4">{group.members}</td>
                    <td className="px-6 py-4">{group.createdAt}</td>
                    <td className="px-6 py-4">{group.leader}</td>
                    <td className="px-6 py-4">
                      <Badge variant={group.status === 'Hoạt động' ? 'active' : 'deleted'}>
                        {group.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h4 className="text-2xl font-bold mb-1">Push Notification Management</h4>
              <p className="text-slate-500 text-sm mb-8">System configuration and runtime parameters for FBV MobileChat.</p>
              
              <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 mb-8">
                <h5 className="font-bold mb-4">Compose Notification</h5>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Audience</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="audience" defaultChecked className="text-orange-500 focus:ring-orange-500" />
                        All users
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-400">
                        <input type="radio" name="audience" className="text-orange-500 focus:ring-orange-500" />
                        Specific users
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Title</label>
                    <input type="text" placeholder="Enter notification title..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Message</label>
                    <textarea rows={3} placeholder="Enter notification message..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none resize-none"></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => openModal({
                        title: 'Xác nhận gửi thông báo',
                        children: 'Bạn có chắc chắn muốn gửi thông báo này cho tất cả người dùng không?',
                        confirmLabel: 'Gửi ngay',
                        type: 'info',
                        onConfirm: () => console.log('Notification sent')
                      })}
                      className="px-12 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
                    >
                      Send Now
                    </button>
                  </div>
                </div>
              </div>

              <h5 className="font-bold mb-4">Notification History</h5>
              <div className="overflow-hidden border border-slate-100 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-orange-500 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Sent Date</th>
                      <th className="px-6 py-3 text-left font-bold">Title</th>
                      <th className="px-6 py-3 text-left font-bold">Audience</th>
                      <th className="px-6 py-3 text-left font-bold">Delivered Count</th>
                      <th className="px-6 py-3 text-left font-bold">Error Count</th>
                      <th className="px-6 py-3 text-left font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { date: '01/04 09:00', title: 'Welcome to April!', audience: 'All (12,483)', delivered: '12,321', error: '162', status: 'Sent' },
                      { date: '30/03 12:00', title: 'System Maintenance Notice', audience: 'Specific (1 user)', delivered: '12,390', error: '1', status: 'Failed' },
                      { date: '30/03 12:00', title: 'System Maintenance Notice', audience: 'All (12,483)', delivered: '1', error: '0', status: 'Sent' },
                    ].map((notif, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">{notif.date}</td>
                        <td className="px-6 py-4 font-medium">{notif.title}</td>
                        <td className="px-6 py-4 text-slate-600">{notif.audience}</td>
                        <td className="px-6 py-4 text-slate-600">{notif.delivered}</td>
                        <td className="px-6 py-4 text-slate-600">{notif.error}</td>
                        <td className="px-6 py-4">
                          <Badge variant={notif.status.toLowerCase()}>{notif.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 space-y-4">
              <h4 className="font-bold text-xl">Media Management</h4>
              <p className="text-slate-500 text-sm">Total Assets: 1,452 (512 Images, 940 Videos)</p>
              
              <div className="flex justify-between items-center pt-4">
                <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-medium">
                  Bulk Actions <ChevronDown size={14} />
                </button>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search media files..." className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left"><input type="checkbox" /></th>
                  <th className="px-6 py-3 text-left font-bold">Media Type</th>
                  <th className="px-6 py-3 text-left font-bold">Content/Filename</th>
                  <th className="px-6 py-3 text-left font-bold">Upload Date <ChevronDown size={14} className="inline" /></th>
                  <th className="px-6 py-3 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: '1', type: 'image', name: 'team-meeting-Jan15.jpg', date: '2024-01-15 10:30:00', thumb: 'https://picsum.photos/seed/media1/100' },
                  { id: '2', type: 'video', name: 'product-demo-v2.mp4', date: '2024-01-14 15:45:22', thumb: 'https://picsum.photos/seed/media2/100' },
                  { id: '3', type: 'image', name: 'logo_white_transparent.png', date: '2024-01-14 10:30:00', thumb: 'https://picsum.photos/seed/media3/100' },
                ].map((media) => (
                  <tr key={media.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4"><input type="checkbox" /></td>
                    <td className="px-6 py-4">
                      {media.type === 'image' ? <ImageIcon size={20} className="text-slate-400" /> : <MessageSquare size={20} className="text-slate-400" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={media.thumb} alt="" className="w-12 h-8 rounded object-cover" />
                        <span className="font-medium">{media.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{media.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 border border-slate-200 rounded hover:bg-white"><FileText size={14} /></button>
                        <button className="p-1.5 border border-slate-200 rounded hover:bg-white"><Download size={14} /></button>
                        <button className="p-1.5 border border-slate-200 rounded hover:bg-white text-rose-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'config':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h4 className="text-2xl font-bold mb-1">System Configuration Settings</h4>
              <p className="text-slate-500 text-sm mb-8">System configuration and runtime parameters for FBV MobileChat.</p>
              
              <h5 className="font-bold mb-4">Active Configuration Keys</h5>
              <div className="overflow-hidden border border-slate-100 rounded-xl mb-8">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Key</th>
                      <th className="px-6 py-3 text-left font-bold">Type</th>
                      <th className="px-6 py-3 text-left font-bold">Current Value</th>
                      <th className="px-6 py-3 text-left font-bold">Last Updated</th>
                      <th className="px-6 py-3 text-left font-bold">Updated By</th>
                      <th className="px-6 py-3 text-center font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { key: 'auth.otp_expiry_sec', type: 'Int', val: '300', date: '01/04/2024 10:30', by: 'admin@fbv.app' },
                      { key: 'auth.otp_resend_cooldown', type: 'Int', val: '60', date: '15/03/2024 14:00', by: 'superadmin@fbv' },
                      { key: 'feed.page_size', type: 'Int', val: '20', date: '10/03/2024 09:00', by: 'content_mgr@fbv.app' },
                    ].map((cfg, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{cfg.key}</td>
                        <td className="px-6 py-4 text-slate-500">{cfg.type}</td>
                        <td className="px-6 py-4 font-bold">{cfg.val}</td>
                        <td className="px-6 py-4 text-slate-500">{cfg.date}</td>
                        <td className="px-6 py-4 text-slate-500">{cfg.by}</td>
                        <td className="px-6 py-4 text-center">
                          <button className="flex items-center gap-1 px-3 py-1 border border-slate-200 rounded text-xs font-medium hover:bg-white">
                            <FileText size={12} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h5 className="font-bold mb-4">Change History</h5>
              <div className="overflow-hidden border border-slate-100 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Time</th>
                      <th className="px-6 py-3 text-left font-medium">Key</th>
                      <th className="px-6 py-3 text-left font-medium">Previous Value</th>
                      <th className="px-6 py-3 text-left font-medium">New Value</th>
                      <th className="px-6 py-3 text-left font-medium">Updated By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4">01/04/2024 10:30</td>
                      <td className="px-6 py-4">auth.otp_expiry_sec</td>
                      <td className="px-6 py-4">180</td>
                      <td className="px-6 py-4 font-bold">300</td>
                      <td className="px-6 py-4">admin@fbv.app</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'rbac':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-bold">Admin Roles & Permissions (RBAC)</h4>
                <p className="text-slate-500 text-sm">RBAC — Kiểm soát truy cập dựa trên vai trò</p>
              </div>
              <button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors">
                [ + Tạo Admin mới ]
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold">ID</th>
                    <th className="px-6 py-3 text-left font-bold">Name</th>
                    <th className="px-6 py-3 text-left font-bold">Email</th>
                    <th className="px-6 py-3 text-left font-bold">Role</th>
                    <th className="px-6 py-3 text-left font-bold">Department</th>
                    <th className="px-6 py-3 text-left font-bold">Status</th>
                    <th className="px-6 py-3 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_ADMINS.map((admin, i) => (
                    <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">{i + 1}</td>
                      <td className="px-6 py-4 font-medium">{admin.name}</td>
                      <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                      <td className="px-6 py-4 text-slate-600">{admin.role}</td>
                      <td className="px-6 py-4 text-slate-600">{admin.department}</td>
                      <td className="px-6 py-4">
                        <Badge variant={admin.status.toLowerCase()}>{admin.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-medium">
                        <button className="hover:underline">Edit</button>
                        <span className="mx-2 text-slate-300">|</span>
                        <button 
                          onClick={() => openModal({
                            title: 'Xác nhận xóa Admin?',
                            children: `Bạn có chắc muốn xóa tài khoản '${admin.name}' không? Hành động này không thể hoàn tác.`,
                            confirmLabel: 'Xác nhận',
                            onConfirm: () => console.log('Deleted admin', admin.id)
                          })}
                          className="hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-slate-100 flex justify-end items-center bg-slate-50/50">
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400">{'<'}</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600">3</button>
                  <span className="px-2 self-center text-slate-400">...</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400">{'>'}</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'chats':
        if (viewMode === 'detail') {
          return (
            <div className="space-y-6">
              <button 
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" /> Back to list
              </button>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h4 className="text-2xl font-bold mb-1">Chat Media & Message Audit View</h4>
                <p className="text-slate-500 text-sm mb-8">Trang chủ / Quản lý Cuộc trò chuyện / {selectedItem?.name}</p>
                
                <div className="flex gap-8 border-b border-slate-100 mb-6">
                  {['Tin nhắn', 'Media', 'File', 'Link'].map((tab) => (
                    <button 
                      key={tab}
                      className={cn(
                        "pb-3 text-sm font-medium transition-colors border-b-2",
                        tab === 'Media' ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <h5 className="font-bold mb-4">Ảnh & Video — 24 files | Tổng dung lượng: 156 MB</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="group relative bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                      <img src={`https://picsum.photos/seed/chat${i}/200`} alt="" className="w-full aspect-square object-cover" />
                      <div className="p-2">
                        <p className="text-[10px] font-bold truncate">IMG_001.jpg</p>
                        <p className="text-[10px] text-slate-400">2.4 MB</p>
                        <p className="text-[10px] text-slate-400">Nguyễn Văn An</p>
                        <p className="text-[10px] text-slate-400">01/04/2026 09:30</p>
                      </div>
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-white rounded-full text-slate-700 hover:bg-blue-50"><Download size={14} /></button>
                          <button className="p-1.5 bg-white rounded-full text-slate-700 hover:bg-blue-50"><ExternalLink size={14} /></button>
                          <button className="p-1.5 bg-white rounded-full text-rose-500 hover:bg-rose-50"><Trash2 size={14} /></button>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] rounded hover:bg-white/30">
                            <Download size={10} /> Tải xuống
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 bg-rose-500/80 backdrop-blur-md text-white text-[10px] rounded hover:bg-rose-600">
                            <Trash2 size={10} /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h4 className="text-2xl font-bold mb-1">Conversation Monitoring List</h4>
              <div className="flex gap-4 mt-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Tìm kiếm cuộc trò chuyện..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button className="px-8 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium">Tất cả</button>
                  <button className="px-8 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium">[Nhóm]</button>
                  <button className="px-8 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium">[1:1]</button>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  { id: '1', type: 'Nhóm', name: 'Backend Dev Squad', info: '8 thành viên', time: '09:45' },
                  { id: '2', type: '1:1', name: 'Nguyễn Văn An → Trần Thị Bình', info: 'Trực tiếp', time: '09:30' },
                  { id: '3', type: 'Nhóm', name: 'TTS Test', info: '28 thành viên', time: '09:15' },
                  { id: '4', type: '1:1', name: 'Lê Văn Cường → Admin', info: 'Trực tiếp', time: '08:55' },
                ].map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => { setSelectedItem(chat); setViewMode('detail'); }}
                    className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase", chat.type === 'Nhóm' ? "bg-blue-600 text-white" : "bg-purple-100 text-purple-700")}>
                        [{chat.type}]
                      </div>
                      <div>
                        <h5 className="font-bold text-sm group-hover:text-blue-600 transition-colors">{chat.name}</h5>
                        <p className="text-xs text-slate-400">{chat.info}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{chat.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'posts':
        if (viewMode === 'detail') {
          return (
            <div className="space-y-6">
              <button 
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" /> Quay lại danh sách
              </button>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h4 className="text-2xl font-bold mb-1">Chi tiết Bài viết</h4>
                <p className="text-slate-500 text-sm mb-8">Trang chủ / Quản lý Bài viết / {selectedItem?.id}</p>
                
                <div className="flex gap-8 border-b border-slate-100 mb-6">
                  {['Chi tiết', 'Bình luận', 'Tương tác'].map((tab) => (
                    <button 
                      key={tab}
                      className={cn(
                        "pb-3 text-sm font-medium transition-colors border-b-2",
                        tab === 'Chi tiết' ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row items-start gap-6">
                  <img src={selectedItem?.media} alt="Post media" className="w-full md:w-1/3 rounded-xl border border-slate-200 shadow-sm" />
                  <div className="flex-1 space-y-4">
                    <div>
                      <h5 className="font-bold text-lg">Tác giả: {selectedItem?.author}</h5>
                      <p className="text-sm text-slate-500">{selectedItem?.date}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-slate-800">{selectedItem?.content}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex gap-2 items-center">
                         <Badge variant={selectedItem?.status === 'Active' ? 'active' : selectedItem?.status === 'Pending' ? 'pending' : 'deleted'}>{selectedItem?.status}</Badge>
                      </div>
                      <div className="text-sm font-medium text-slate-600">👍 {selectedItem?.likes} Lượt thích</div>
                      <div className="text-sm font-medium text-slate-600">💬 {selectedItem?.comments} Bình luận</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h5 className="font-bold mb-4">Danh sách Bình luận & Tương tác</h5>
                  <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-6 py-3 text-left font-bold">Người dùng</th>
                          <th className="px-6 py-3 text-left font-bold">Nội dung bình luận</th>
                          <th className="px-6 py-3 text-left font-bold">Thời gian</th>
                          <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
                          <th className="px-6 py-3 text-left font-bold">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MOCK_INTERACTIONS.map((item, i) => ( 
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium flex items-center gap-3">
                              <img src={item.avatar} alt="" className="w-8 h-8 rounded-full shadow-sm" />
                              {item.user}
                            </td>
                            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{item.content}</td>
                            <td className="px-6 py-4 text-slate-500">{item.time}</td>
                            <td className="px-6 py-4">
                              <Badge variant={item.status === 'Active' ? 'active' : 'suspended'}>{item.status}</Badge>
                            </td>
                            <td className="px-6 py-4 text-rose-500 font-bold cursor-pointer hover:underline">[Xóa]</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xl">Quản lý Bài viết</h4>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                    <RefreshCw size={16} />
                    Làm mới
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                    <Filter size={16} />
                    Bộ lọc
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Tìm kiếm bài viết theo tác giả, nội dung..." className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-[#1e293b] text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">Hình ảnh</th>
                  <th className="px-6 py-3 text-left font-bold">Nội dung</th>
                  <th className="px-6 py-3 text-left font-bold">Tác giả</th>
                  <th className="px-6 py-3 text-left font-bold">Tương tác</th>
                  <th className="px-6 py-3 text-left font-bold">Ngày đăng</th>
                  <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_POSTS.map((post) => (
                  <tr 
                    key={post.id} 
                    onClick={() => { setSelectedItem(post); setViewMode('detail'); }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <img src={post.media} alt="" className="w-16 h-12 object-cover rounded shadow-sm border border-slate-200" />
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{post.content}</td>
                    <td className="px-6 py-4 font-medium group-hover:text-blue-600">{post.author}</td>
                    <td className="px-6 py-4 text-slate-500">
                      👍 {post.likes} <span className="mx-1 text-slate-300">|</span> 💬 {post.comments}
                    </td>
                    <td className="px-6 py-4">{post.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant={post.status === 'Active' ? 'active' : post.status === 'Pending' ? 'pending' : 'deleted'}>
                        {post.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h4 className="text-2xl font-bold mb-1">Cài đặt Tài khoản</h4>
              <p className="text-slate-500 text-sm mb-8">Quản lý thông tin tài khoản và tùy chọn hiển thị cá nhân.</p>
              
              <div className="space-y-8">
                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">THÔNG TIN CÁ NHÂN</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Tên hiển thị:</label>
                      <input 
                        type="text" 
                        defaultValue="Super Admin" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email:</label>
                      <input 
                        type="email" 
                        defaultValue="admin@fbv.app" 
                        disabled
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">ĐỔI MẬT KHẨU</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Mật khẩu hiện tại:</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Mật khẩu mới:</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nhập lại mật khẩu mới:</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">TÙY CHỌN HIỂN THỊ</h5>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-700">Nhận thông báo qua email khi có báo cáo vi phạm mới</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-700">Hiển thị thông báo popup trong trình duyệt</span>
                    </label>
                  </div>
                </section>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors">Hủy đổi</button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Lưu Cài đặt</button>
            </div>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h4 className="text-2xl font-bold mb-1">Audit Logs</h4>
              <p className="text-slate-500 text-sm mb-8">Nhật ký hoạt động của quản trị viên hệ thống.</p>
              
              <div className="overflow-hidden border border-slate-100 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Time</th>
                      <th className="px-6 py-3 text-left font-bold">Admin</th>
                      <th className="px-6 py-3 text-left font-bold">Action</th>
                      <th className="px-6 py-3 text-left font-bold">Target</th>
                      <th className="px-6 py-3 text-left font-bold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { time: '01/04/2026 10:30', admin: 'admin@fbv.app', action: 'Update Config', target: 'auth.otp_expiry_sec', ip: '1.2.3.4' },
                      { time: '01/04/2026 10:15', admin: 'superadmin@fbv', action: 'Delete User', target: 'user_992', ip: '5.6.7.8' },
                      { time: '01/04/2026 10:00', admin: 'content_mgr@fbv.app', action: 'Delete Post', target: 'post_123', ip: '9.10.11.12' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500">{log.time}</td>
                        <td className="px-6 py-4 font-medium">{log.admin}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase">{log.action}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{log.target}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <LayoutDashboard size={64} strokeWidth={1} className="mb-4" />
            <p className="text-lg">Screen "{activeTab}" is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm">FBV MobileChat</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Backoffice v1.0</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">OVERVIEW</p>
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
          </div>

          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">QUẢN LÝ</p>
            <SidebarItem 
              icon={Users} 
              label="Người dùng" 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
            />
            <SidebarItem 
              icon={UserCircle} 
              label="Nhóm" 
              active={activeTab === 'groups'} 
              onClick={() => setActiveTab('groups')} 
            />
            <SidebarItem 
              icon={FileText} 
              label="Bài viết" 
              active={activeTab === 'posts'} 
              onClick={() => setActiveTab('posts')} 
            />
            <SidebarItem 
              icon={MessageSquare} 
              label="Cuộc trò chuyện" 
              active={activeTab === 'chats'} 
              onClick={() => setActiveTab('chats')} 
            />
            <SidebarItem 
              icon={Bell} 
              label="Thông báo" 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')} 
            />
            <SidebarItem 
              icon={FileText} 
              label="Audit Logs" 
              active={activeTab === 'audit'} 
              onClick={() => setActiveTab('audit')} 
            />
          </div>

          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">HỆ THỐNG</p>
            <SidebarItem 
              icon={Settings} 
              label="Cấu hình" 
              active={activeTab === 'config'} 
              onClick={() => setActiveTab('config')} 
            />
            <SidebarItem 
              icon={ShieldCheck} 
              label="Phân quyền" 
              active={activeTab === 'rbac'} 
              onClick={() => setActiveTab('rbac')} 
            />
            <SidebarItem 
              icon={ImageIcon} 
              label="Phương tiện" 
              active={activeTab === 'media'} 
              onClick={() => setActiveTab('media')} 
            />
            <SidebarItem 
              icon={Settings} 
              label="Cài đặt" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
            <SidebarItem 
              icon={ImageIcon} 
              label="App Branding & Basic Settings" 
              active={activeTab === 'branding'} 
              onClick={() => setActiveTab('branding')} 
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
              <UserCircle size={24} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Super Admin</p>
              <p className="text-[10px] text-slate-500 truncate">admin@fbv.app</p>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Trang chủ</span>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded uppercase">ADMIN</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Modal Instance */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        {...modalConfig} 
      />
    </div>
  );
}
