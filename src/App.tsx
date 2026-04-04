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
  AlertTriangle,
  Video,
  Phone,
  UserPlus,
  Activity,
  Heart,
  Share2,
  Database,
  HardDrive,
  MessageCircle,
  Send,
  PhoneCall,
  Zap,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import {
  MOCK_USERS,
  MOCK_GROUPS,
  MOCK_POSTS,
  MOCK_ADMINS,
  CHART_DATA_7DAYS,
  CHART_DATA_30DAYS,
  MOCK_AUDIT_LOGS,
  MOCK_NOTIFICATIONS,
  MOCK_MEDIA,
  CONFIG_KEYS,
  MOCK_CONVERSATIONS,
  MOCK_INTERACTIONS,
  DASHBOARD_DETAILED_STATS,
  STORAGE_HISTORY_DATA
} from './mockData';
import { Admin } from './types';
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
              onClick={() => { if (onConfirm) onConfirm(); onClose(); }}
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

const ResourceWidget = ({ title, stats, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-full transition-all hover:shadow-md hover:border-blue-100"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2.5 rounded-lg text-white", color)}>
        <Icon size={20} />
      </div>
    </div>
    <div>
      <h5 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-2">{title}</h5>
      <div className="space-y-1.5">
        {stats.map((stat: any, i: number) => (
          <div key={i} className="flex justify-between items-baseline border-b border-slate-50 pb-1 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500">{stat.label}</span>
            <span className="text-sm font-bold text-slate-800">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const FeatureToggle = ({ label, description, enabled, onChange, icon: Icon }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-100 transition-all group">
    <div className="flex items-center gap-3">
      <div className={cn("p-2 rounded-lg transition-colors", enabled ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-400")}>
        <Icon size={18} />
      </div>
      <div>
        <h6 className="text-sm font-bold text-slate-700">{label}</h6>
        <p className="text-[10px] text-slate-400">{description}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none",
        enabled ? "bg-blue-600 shadow-lg shadow-blue-500/30" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  </div>
);

const SystemStatusWidget = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Activity size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm">Trạng thái hệ thống</h4>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Live Monitoring</p>
        </div>
      </div>
      <div className="space-y-4">
        {[
          { label: 'Phiên bản App', value: 'v2.4.1', status: 'update-ready' },
          { label: 'Máy chủ Agora', value: 'Ổn định', status: 'online' },
          { label: 'Cơ sở dữ liệu', value: 'Đang kết nối', status: 'online' },
          { label: 'Admin trực tuyến', value: '4 người', status: 'online' },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">{item.value}</span>
              <div className={cn("w-2 h-2 rounded-full animate-pulse", item.status === 'online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]")}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* <button className="w-full mt-6 py-2.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-100">
      [ Xem nhật ký chi tiết ]
    </button> */}
  </div>
);

const DashboardSection = ({ title, icon: Icon, children, color = "text-blue-600" }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full transition-all hover:shadow-md hover:border-blue-100/50">
    <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-white shadow-sm border border-slate-100", color)}>
          <Icon size={18} />
        </div>
        <h4 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h4>
      </div>
      {/* <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
        [ Chi tiết ]
      </button> */}
    </div>
    <div className="p-5 flex-1 select-none">
      {children}
    </div>
  </div>
);

const MiniMetric = ({ label, value, icon: Icon, trend, subValue, trendUp = true }: any) => (
  <div className="flex items-center justify-between py-2.5 group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <Icon size={14} />
        </div>
      )}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-bold text-slate-700">{value}</p>
          {subValue && <span className="text-[10px] text-slate-400 font-medium">{subValue}</span>}
        </div>
      </div>
    </div>
    {trend && (
      <div className={cn("flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full", trendUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50")}>
        {trendUp ? <TrendingUp size={10} /> : <div className="rotate-180"><TrendingUp size={10} /></div>}
        {trend}
      </div>
    )}
  </div>
);



// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<any>({});
  const [chatDetailTab, setChatDetailTab] = useState('Tin nhắn');
  const [postDetailTab, setPostDetailTab] = useState('Chi tiết');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>(MOCK_ADMINS);

  const openModal = (config: any) => {
    setModalConfig(config);
    setIsModalOpen(true);
  };

  const handleEditPermissions = (admin: Admin) => {
    let currentPermissions = [...(admin.permissions || [])];

    const PermissionItem = ({ permission, isChecked, onChange }: any) => (
      <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
        <input
          type="checkbox"
          defaultChecked={isChecked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
        />
        <div>
          <p className="text-sm font-bold text-slate-700">{permission.label}</p>
          <p className="text-[10px] text-slate-400 leading-tight">{permission.description}</p>
        </div>
      </label>
    );

    openModal({
      title: `Chỉnh sửa phân quyền: ${admin.name}`,
      type: 'form',
      wide: true,
      children: (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {admin.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-800">{admin.name}</p>
                <p className="text-xs text-slate-500">{admin.role} • {admin.department}</p>
              </div>
            </div>
          </div>

          {PERMISSION_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{group.title}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.permissions.map((p) => (
                  <PermissionItem
                    key={p.id}
                    permission={p}
                    isChecked={currentPermissions.includes(p.id)}
                    onChange={(checked: boolean) => {
                      if (checked) {
                        if (!currentPermissions.includes(p.id)) currentPermissions.push(p.id);
                      } else {
                        currentPermissions = currentPermissions.filter(id => id !== p.id);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
      confirmLabel: 'Lưu thay đổi',
      onConfirm: () => {
        setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, permissions: currentPermissions } : a));
        console.log('Updated permissions for', admin.name, currentPermissions);
      }
    });
  };

  const PERMISSION_GROUPS = [
    {
      title: 'OVERVIEW',
      permissions: [
        { id: 'dashboard', label: 'Dashboard', description: 'Xem tổng quan hệ thống và thống kê' },
      ]
    },
    {
      title: 'QUẢN LÝ',
      permissions: [
        { id: 'users', label: 'Người dùng', description: 'Quản lý tài khoản người dùng, khóa/mở khóa' },
        { id: 'groups', label: 'Nhóm', description: 'Quản lý các nhóm chat và thành viên' },
        { id: 'posts', label: 'Bài viết', description: 'Kiểm duyệt bài viết và bình luận' },
        { id: 'chats', label: 'Cuộc trò chuyện', description: 'Theo dõi và kiểm duyệt nội dung tin nhắn' },
        { id: 'notifications', label: 'Thông báo', description: 'Gửi thông báo Push cho người dùng' },
        { id: 'audit', label: 'Audit Logs', description: 'Xem nhật ký hoạt động hệ thống' },
      ]
    },
    {
      title: 'HỆ THỐNG',
      permissions: [
        { id: 'config', label: 'Cấu hình', description: 'Chỉnh sửa tham số kỹ thuật hệ thống' },
        { id: 'rbac', label: 'Phân quyền', description: 'Quản lý tài khoản admin và quyền truy cập' },
        { id: 'media', label: 'Phương tiện', description: 'Quản lý kho tệp tin hình ảnh, video' },
        { id: 'settings', label: 'Cài đặt', description: 'Cài đặt tài khoản cá nhân' },
        { id: 'branding', label: 'Branding', description: 'Cài đặt giao diện và thương hiệu app' },
      ]
    }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewMode('list');
    setSelectedItem(null);
    setSearchQuery('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Top Row: Primary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                label="Người dùng đăng ký"
                value="12,483"
                trend="+142"
                color="bg-blue-600"
                icon={Users}
              />
              <StatCard
                label="Cuộc trò chuyện"
                value="12,483"
                trend="+842"
                color="bg-indigo-600"
                icon={MessageCircle}
              />
              <StatCard
                label="Dung lượng"
                value="1.2 TB"
                trend="+12 GB"
                color="bg-amber-600"
                icon={HardDrive}
              />
              <StatCard
                label="Bị khóa"
                value="47"
                trend="+3"
                color="bg-rose-600"
                icon={ShieldCheck}
              />
            </div>

            {/* Middle Row: Specialized Modules */}
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-8 mb-2 px-1">Cấu trúc chi tiết hệ thống</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Content & Social */}
              <DashboardSection title="Content & Social" icon={FileText} color="text-blue-600">
                <div className="space-y-1">
                  <MiniMetric
                    label="Tổng số bài viết"
                    value={DASHBOARD_DETAILED_STATS.content.totalPosts.toLocaleString()}
                    icon={FileText}
                    trend="2.4%"
                  />
                  <MiniMetric
                    label="Bài viết mới hôm nay"
                    value={DASHBOARD_DETAILED_STATS.content.newPostsToday.toLocaleString()}
                    icon={Plus}
                    trend="+12"
                  />
                  <MiniMetric
                    label="Tổng số nhóm"
                    value={DASHBOARD_DETAILED_STATS.content.totalGroups.toLocaleString()}
                    icon={Users}
                  />
                  <MiniMetric
                    label="Nhóm hoạt động nhiều nhất"
                    value={DASHBOARD_DETAILED_STATS.content.mostActiveGroup}
                    icon={Zap}
                    subValue="1.2k tương tác"
                  />
                </div>
              </DashboardSection>

              {/* Storage & System */}
              <DashboardSection title="Storage & System" icon={Database} color="text-amber-600">
                <div className="space-y-1">
                  <MiniMetric
                    label="Tổng dung lượng"
                    value={DASHBOARD_DETAILED_STATS.storage.totalUsed}
                    icon={HardDrive}
                    trend="1.2%"
                    trendUp={false}
                  />
                  <div className="mt-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        <span>Media</span>
                        <span>{DASHBOARD_DETAILED_STATS.storage.media}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        <span>File</span>
                        <span>{DASHBOARD_DETAILED_STATS.storage.files}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        <span>Message</span>
                        <span>{DASHBOARD_DETAILED_STATS.storage.messages}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardSection>

              {/* Communication (Core hệ thống) */}
              <DashboardSection title="Communication" icon={MessageCircle} color="text-indigo-600">
                <div className="space-y-1">
                  <MiniMetric
                    label="Tổng số cuộc trò chuyện"
                    value={DASHBOARD_DETAILED_STATS.communication.totalConversations.toLocaleString()}
                    icon={MessageCircle}
                    trend="+124"
                  />
                  <MiniMetric
                    label="Tin nhắn gửi hôm nay"
                    value={DASHBOARD_DETAILED_STATS.communication.messagesSentToday.toLocaleString()}
                    icon={Send}
                    trend="5.2%"
                  />
                  <MiniMetric
                    label="Số cuộc gọi Voice"
                    value={DASHBOARD_DETAILED_STATS.communication.voiceCalls.toLocaleString()}
                    icon={PhoneCall}
                  />
                  <MiniMetric
                    label="Thời lượng gọi"
                    value={`${DASHBOARD_DETAILED_STATS.communication.voiceDurationMin.toLocaleString()} min`}
                    icon={Clock}
                  />
                </div>
              </DashboardSection>
            </div>

            {/* Bottom Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-800">Tăng trưởng người dùng mới</h4>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">[ 7 Ngày ]</button>
                    <button className="px-3 py-1 text-slate-400 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors">30 Ngày</button>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA_7DAYS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-800">Tăng trưởng dung lượng (GB)</h4>
                  <TrendingUp className="text-emerald-500" size={20} />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STORAGE_HISTORY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="usage" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2">
                <SystemStatusWidget />
              </div>
            </div>

            {/* <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800">Hoạt động gần đây</h4>
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
                        <td className="px-6 py-4 text-slate-600 text-emerald-500 font-medium">{row.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
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
                              <option value="Chờ XÁC NHẬN">Chờ XÁC NHẬN</option>
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

              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 text-emerald-600">
                  <ShieldCheck size={20} />
                  <h4 className="text-lg font-bold text-slate-800">Quản lý tính năng người dùng</h4>
                  <div className="h-[1px] flex-1 bg-slate-100 ml-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FeatureToggle
                    label="Bài viết"
                    description="Cho phép đăng và xem bài viết"
                    enabled={selectedItem?.appFeatures?.posts ?? true}
                    onChange={(val: boolean) => setSelectedItem({ ...selectedItem, appFeatures: { ...selectedItem.appFeatures, posts: val } })}
                    icon={FileText}
                  />
                  <FeatureToggle
                    label="Nhóm"
                    description="Cho phép tạo và tham gia nhóm"
                    enabled={selectedItem?.appFeatures?.groups ?? true}
                    onChange={(val: boolean) => setSelectedItem({ ...selectedItem, appFeatures: { ...selectedItem.appFeatures, groups: val } })}
                    icon={Users}
                  />
                  <FeatureToggle
                    label="Kết bạn"
                    description="Cho phép gửi lời mời kết bạn"
                    enabled={selectedItem?.appFeatures?.friends ?? true}
                    onChange={(val: boolean) => setSelectedItem({ ...selectedItem, appFeatures: { ...selectedItem.appFeatures, friends: val } })}
                    icon={UserPlus}
                  />
                  <FeatureToggle
                    label="Nhật ký"
                    description="Cho phép ghi nhật ký hoạt động"
                    enabled={selectedItem?.appFeatures?.workLog ?? true}
                    onChange={(val: boolean) => setSelectedItem({ ...selectedItem, appFeatures: { ...selectedItem.appFeatures, workLog: val } })}
                    icon={History}
                  />
                  <FeatureToggle
                    label="Cuộc gọi"
                    description="Cho phép gọi Voice và Video"
                    enabled={selectedItem?.appFeatures?.calls ?? true}
                    onChange={(val: boolean) => setSelectedItem({ ...selectedItem, appFeatures: { ...selectedItem.appFeatures, calls: val } })}
                    icon={Phone}
                  />
                  <FeatureToggle
                    label="Nhắn tin"
                    description="Cho phép trò chuyện trực tiếp"
                    enabled={selectedItem?.appFeatures?.messaging ?? true}
                    onChange={(val: boolean) => setSelectedItem({ ...selectedItem, appFeatures: { ...selectedItem.appFeatures, messaging: val } })}
                    icon={MessageSquare}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Activity size={20} className="text-blue-600" />
                  <h4 className="text-lg font-bold text-slate-800">Hoạt động người dùng</h4>
                  <div className="h-[1px] flex-1 bg-slate-100 ml-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Bài viết */}
                  <ResourceWidget
                    title="Bài viết"
                    icon={FileText}
                    color="bg-blue-500"
                    onClick={() => setActiveTab('posts')}
                    stats={[
                      { label: 'Tổng bài viết', value: selectedItem?.resourceStats?.posts.count || 0 },
                      { label: 'Dung lượng', value: selectedItem?.resourceStats?.posts.storage || '0 MB' }
                    ]}
                  />

                  {/* Nhóm */}
                  <ResourceWidget
                    title="Nhóm"
                    icon={Users}
                    color="bg-emerald-500"
                    onClick={() => setActiveTab('groups')}
                    stats={[
                      { label: 'Đã tạo', value: selectedItem?.resourceStats?.groups.created || 0 },
                      { label: 'Đã tham gia', value: selectedItem?.resourceStats?.groups.joined || 0 }
                    ]}
                  />

                  {/* Kết bạn */}
                  <ResourceWidget
                    title="Kết bạn"
                    icon={UserPlus}
                    color="bg-purple-500"
                    onClick={() => { }} // No specific tab yet
                    stats={[
                      { label: 'Lời mời đã gửi', value: selectedItem?.resourceStats?.friendship.sent || 0 },
                      { label: 'Lời mời đã nhận', value: selectedItem?.resourceStats?.friendship.received || 0 }
                    ]}
                  />

                  {/* Nhật ký làm việc */}
                  <ResourceWidget
                    title="Nhật ký làm việc"
                    icon={History}
                    color="bg-orange-500"
                    onClick={() => setActiveTab('audit')}
                    stats={[
                      { label: 'Tổng hoạt động', value: selectedItem?.resourceStats?.workLog.total || 0 },
                      { label: 'Lần cuối', value: 'Hôm nay' }
                    ]}
                  />

                  {/* Gọi Voice/Video */}
                  <ResourceWidget
                    title="Cuộc gọi"
                    icon={Phone}
                    color="bg-rose-500"
                    onClick={() => { }} // No specific tab yet
                    stats={[
                      { label: 'Gọi Voice', value: `${selectedItem?.resourceStats?.calls.voice.made || 0} đi / ${selectedItem?.resourceStats?.calls.voice.received || 0} đến` },
                      { label: 'Gọi Video', value: `${selectedItem?.resourceStats?.calls.video.made || 0} đi / ${selectedItem?.resourceStats?.calls.video.received || 0} đến` }
                    ]}
                  />

                  {/* Nhắn tin */}
                  <ResourceWidget
                    title="Nhắn tin"
                    icon={MessageSquare}
                    color="bg-indigo-500"
                    onClick={() => setActiveTab('chats')}
                    stats={[
                      { label: 'Cuộc trò chuyện', value: selectedItem?.resourceStats?.messaging.conversations || 0 },
                      { label: 'Tin nhắn mới', value: '0' }
                    ]}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h5 className="font-bold">Login Device List</h5>
                  <button
                    onClick={() => openModal({
                      title: 'Đăng xuất tất cả thiết bị?',
                      children: 'Bạn có chắc muốn đăng xuất tài khoản khỏi tất cả các thiết bị đang đăng nhập không?',
                      confirmLabel: 'Đăng xuất tất cả',
                      type: 'danger',
                      onConfirm: () => console.log('Logged out all devices')
                    })}
                    className="text-xs font-bold text-rose-500 hover:underline px-2 py-1 bg-rose-50 rounded"
                  >
                    [Đăng xuất tất cả]
                  </button>
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
                          user.status === 'Chờ XÁC NHẬN' ? 'pending' :
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
          </div>
        );
      case 'branding':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h4 className="text-2xl font-bold mb-1">Cài đặt ứng dụng</h4>
              <p className="text-slate-500 text-sm mb-8">Quản lý tên và nhận diện thương hiệu ứng dụng.</p>

              <div className="space-y-8">
                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Cài đặt cơ bản</h5>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tên ứng dụng</label>
                    <input
                      type="text"
                      defaultValue="FBV MobileChat"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </section>

                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Quản lý logo</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-slate-100 rounded-xl p-6 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Logo hiện tại</p>
                      <div className="w-32 h-32 bg-[#1e293b] rounded-xl mx-auto flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-3xl">FBV</span>
                      </div>
                      <p className="text-sm font-medium">FBV 192x192 px</p>
                      <p className="text-xs text-slate-400">[ Logo hiện tại]</p>
                    </div>

                    <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Tải lên logo mới</p>
                      <div className="w-12 h-12 text-slate-300 mb-4">
                        <Download size={48} strokeWidth={1} />
                      </div>
                      <p className="text-sm text-slate-600 mb-1">Thả file PNG/SVG vào đây để tải lên</p>
                      <p className="text-[10px] text-slate-400 mb-4">Kích thước đề xuất: 512x512 px, nền trong suốt</p>
                      <button className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-medium hover:bg-white transition-colors">
                        [ Choose File ]
                      </button>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-6 text-center bg-slate-50/30">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Xem trước logo mới</p>
                      <div className="w-32 h-32 bg-slate-200 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <ImageIcon size={48} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-400">[ Xem trước logo mới ]</p>
                      <p className="text-xs text-slate-400">Sẽ hoạt động sau khi tải lên và lưu</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Lịch sử thay đổi cài đặt</h5>
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
                    {MOCK_NOTIFICATIONS.map((notif, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">{notif.date}</td>
                        <td className="px-6 py-4 font-medium">{notif.title}</td>
                        <td className="px-6 py-4 text-slate-600">{notif.audience}</td>
                        <td className="px-6 py-4 text-center font-bold text-blue-600">{notif.delivered}</td>
                        <td className="px-6 py-4 text-center font-bold text-rose-500">{notif.error}</td>
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
                {/* <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-medium">
                  Bulk Actions <ChevronDown size={14} />
                </button> */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search media files..." className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {/* <th className="px-6 py-3 text-left"><input type="checkbox" /></th> */}
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
                        <button
                          onClick={() => openModal({
                            title: 'Chi tiết tệp tin',
                            children: (
                              <div className="space-y-4">
                                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                  <img src={media.thumb} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                  <span className="text-slate-400 font-bold uppercase text-[10px]">Tên tệp</span>
                                  <span className="text-slate-400 font-bold uppercase text-[10px]">Định dạng</span>
                                  <span className="font-medium">{media.name}</span>
                                  <span className="font-medium uppercase">{media.type}</span>
                                  <span className="text-slate-400 font-bold uppercase text-[10px] mt-2">Ngày tải lên</span>
                                  <span className="text-slate-400 font-bold uppercase text-[10px] mt-2">Dung lượng</span>
                                  <span className="font-medium">{media.date}</span>
                                  <span className="font-medium">2.4 MB</span>
                                </div>
                              </div>
                            ),
                            confirmLabel: 'Đóng',
                            type: 'info'
                          })}
                          className="p-1.5 border border-slate-200 rounded hover:bg-white"
                        >
                          <FileText size={14} />
                        </button>
                        <button className="p-1.5 border border-slate-200 rounded hover:bg-white"><Download size={14} /></button>
                        <button
                          onClick={() => openModal({
                            title: 'Xóa tệp tin?',
                            children: `Bạn có chắc muốn xóa tệp "${media.name}" không? Thao tác này sẽ gỡ tệp khỏi toàn bộ các cuộc trò chuyện.`,
                            confirmLabel: 'Xóa vĩnh viễn',
                            type: 'danger',
                            onConfirm: () => console.log('Deleted media', media.id)
                          })}
                          className="p-1.5 border border-slate-200 rounded hover:bg-white text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
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
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Hệ thống /</span>
                <span className="text-slate-800 font-medium font-bold">Thương hiệu & Cấu hình</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Cấu hình Ứng dụng</h1>
              <p className="text-sm text-slate-500">Quản lý nhận diện thương hiệu và thông tin cơ bản của FBV MobileChat</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="text-blue-600" size={20} />
                    Thông tin cơ bản
                  </h4>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 block">Tên ứng dụng hiển thị</label>
                      <input
                        type="text"
                        defaultValue="FBV MobileChat"
                        placeholder="Nhập tên ứng dụng..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                      />
                      <p className="text-[10px] text-slate-400">Tên này sẽ hiển thị trên thanh tiêu đề, email thông báo và các tin nhắn hệ thống.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 block">Phiên bản hiện tại</label>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs border border-blue-100">v1.2.4-stable</span>
                        <button className="text-xs text-blue-600 font-bold hover:underline">Kiểm tra cập nhật</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" size={20} />
                    Trạng thái hệ thống
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Máy chủ API</span>
                      <Badge variant="active">Đang hoạt động</Badge>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Cơ sở dữ liệu</span>
                      <Badge variant="active">Đang hoạt động</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <h4 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-widest w-full text-left">Logo Ứng dụng</h4>

                  <div className="relative group">
                    <div className="w-32 h-32 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-blue-500/20 mb-6 group-hover:scale-105 transition-transform duration-300">
                      FBV
                    </div>
                    <button
                      onClick={() => openModal({
                        title: 'Thay đổi Logo',
                        children: 'Tính năng tải ảnh logo mới sẽ được triển khai trong bản cập nhật tiếp theo.',
                        confirmLabel: 'Đã hiểu'
                      })}
                      className="absolute bottom-4 right-[-8px] p-2 bg-white rounded-full shadow-lg border border-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <ImageIcon size={18} />
                    </button>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs py-8 bg-slate-50">
                      Kéo thả logo mới vào đây <br /> (Hỗ trợ PNG, SVG, JPG)
                    </div>
                    <button className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                      [ + Tải ảnh mới ]
                    </button>
                  </div>
                </div>

                <div className="bg-blue-600 p-8 rounded-2xl shadow-lg shadow-blue-500/20 text-white space-y-4">
                  <h5 className="font-bold">Lưu thay đổi</h5>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Mọi thay đổi về cấu hình sẽ được áp dụng ngay lập tức cho tất cả người dùng cuối.
                  </p>
                  <button
                    onClick={() => openModal({
                      title: 'Xác nhận cập nhật',
                      children: 'Bạn có chắc chắn muốn lưu các thay đổi cấu hình này không?',
                      onConfirm: () => console.log('Config Updated')
                    })}
                    className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    Lưu cấu hình ngay
                  </button>
                </div>
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
              <button
                onClick={() => openModal({
                  title: 'Thêm Quản trị viên mới',
                  children: (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Họ và tên</label>
                          <input type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Email</label>
                          <input type="email" placeholder="admin@fbv.app" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Vai trò</label>
                          <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white">
                            <option>Admin</option>
                            <option>Moderator</option>
                            <option>Content Manager</option>
                            <option>Viewer</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Phòng ban</label>
                          <input type="text" placeholder="Technology" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  ),
                  confirmLabel: 'Tạo tài khoản',
                  onConfirm: () => console.log('Admin created')
                })}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
              >
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
                    <th className="px-6 py-3 text-left font-bold">Permissions</th>
                    <th className="px-6 py-3 text-left font-bold">Status</th>
                    <th className="px-6 py-3 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((admin, i) => (
                    <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">{i + 1}</td>
                      <td className="px-6 py-4 font-medium">{admin.name}</td>
                      <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{admin.role}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{admin.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(admin.permissions || []).slice(0, 3).map(p => (
                            <span key={p} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[9px] font-bold uppercase">{p}</span>
                          ))}
                          {(admin.permissions || []).length > 3 && (
                            <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 rounded text-[9px] font-bold tracking-tighter">+{admin.permissions!.length - 3}</span>
                          )}
                          {(admin.permissions || []).length === 0 && (
                            <span className="text-[10px] text-slate-400 italic">No permissions</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={admin.status.toLowerCase()}>{admin.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-medium">
                        <button
                          onClick={() => handleEditPermissions(admin)}
                          className="hover:underline flex items-center gap-1"
                        >
                          <Settings size={12} /> Edit
                        </button>
                        <span className="mx-2 text-slate-300">|</span>
                        <button
                          onClick={() => openModal({
                            title: 'Xác nhận xóa Admin?',
                            children: `Bạn có chắc muốn xóa tài khoản '${admin.name}' không? Hành động này không thể hoàn tác.`,
                            confirmLabel: 'Xác nhận',
                            onConfirm: () => setAdmins(prev => prev.filter(a => a.id !== admin.id))
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
          const conversation = selectedItem;
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Trang chủ / Quản lý Cuộc trò chuyện /</span>
                  <span className="text-slate-800 font-medium">Chi tiết</span>
                </div>
                <button
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ChevronRight size={16} className="rotate-180" /> Quay lại danh sách
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[700px]">
                  <div className="p-4 border-b border-slate-100 flex gap-6">
                    {['Tin nhắn', 'Media', 'Link', 'File'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setChatDetailTab(tab)}
                        className={cn(
                          "pb-2 text-sm font-bold transition-all relative",
                          chatDetailTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {tab}
                        {chatDetailTab === tab && (
                          <motion.div layoutId="chatTab" className="absolute -bottom-[11px] left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 p-6 overflow-hidden">
                    {chatDetailTab === 'Tin nhắn' && (
                      <div className="h-[600px] flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                          {[
                            { id: '1', sender: 'Nguyễn Văn An', time: '10:00', content: 'Chào mọi người, dự án mới thế nào rồi?', type: 'text' },
                            { id: '2', sender: 'Trần Thị Bình', time: '10:02', content: 'Đang tiến triển tốt nhé An.', type: 'text' },
                            { id: '3', sender: 'Nguyễn Văn An', time: '10:05', content: 'Tuyệt vời! Gửi mình file spec nhé.', type: 'text' },
                            { id: '4', sender: 'Lê Văn Cường', time: '10:10', content: 'Đây là file spec mới nhất.', type: 'file', fileName: 'spec_v2.pdf' },
                          ].map((msg, i) => (
                            <div key={i} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-700">{msg.sender}</span>
                                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                                </div>
                                <div className="bg-slate-100 px-4 py-2 rounded-2xl rounded-tl-sm text-sm text-slate-600 max-w-md shadow-sm">
                                  {msg.type === 'file' ? (
                                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                                      <FileText size={16} />
                                      {msg.fileName}
                                    </div>
                                  ) : msg.content}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3 text-amber-700 text-xs font-medium">
                          <AlertTriangle size={16} />
                          Chế độ kiểm duyệt: Chỉ xem nội dung, không thể gửi tin nhắn.
                        </div>
                      </div>
                    )}
                    {chatDetailTab === 'Media' && (
                      <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden group relative">
                            <img src={`https://picsum.photos/seed/media${i}/200`} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button className="p-2 bg-white rounded-full text-slate-800 hover:bg-blue-50"><Download size={16} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {chatDetailTab === 'Link' && (
                      <div className="space-y-3">
                        <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                          <p className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">https://google.com</p>
                          <p className="text-xs text-slate-400 mt-1">Gửi bởi Nguyễn Văn An • 10:05 01/01/2025</p>
                        </div>
                      </div>
                    )}
                    {chatDetailTab === 'File' && (
                      <div className="space-y-3">
                        <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">bao_cao_quy_1.pdf</p>
                              <p className="text-xs text-slate-400">2.4 MB • 01/01/2025</p>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-blue-600"><Download size={20} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-[400px] space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
                    <div className="mb-4 relative">
                      {conversation?.type === 'direct' ? (
                        <div className="flex -space-x-4">
                          {conversation.avatar.map((img: string, idx: number) => (
                            <img key={idx} src={img} alt="" className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-sm" />
                          ))}
                        </div>
                      ) : (
                        <img src={conversation?.avatar[0]} alt="" className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-sm" />
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">{conversation?.name}</h4>
                    <p className="text-sm text-slate-400 mt-1">{conversation?.type === 'group' ? 'Nhóm trò chuyện' : 'Trò chuyện cá nhân'}</p>

                    <div className="w-full mt-6 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">ID Phòng</span>
                        <span className="font-bold text-slate-700">#{conversation?.id}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Số lượng</span>
                        <span className="font-bold text-slate-700">{conversation?.members.length} thành viên</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Tạo lúc</span>
                        <span className="font-bold text-slate-700">{conversation?.createdAt}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Trạng thái</span>
                        <Badge variant="active">{conversation?.status === 'active' ? 'Hoạt động' : 'Đã giải tán'}</Badge>
                      </div>
                    </div>

                    {conversation?.type === 'group' && (
                      <button
                        onClick={() => openModal({
                          title: 'Giải tán nhóm?',
                          children: 'Hành động này sẽ xóa vĩnh viễn toàn bộ tin nhắn và thành viên khỏi nhóm. Bạn có chắc chắn muốn tiếp tục?',
                          confirmLabel: 'Giải tán ngay',
                          onConfirm: () => console.log('Dissolved')
                        })}
                        className="w-full mt-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-colors"
                      >
                        Giải tán nhóm
                      </button>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-slate-800 text-sm">Danh sách thành viên</h5>
                        <span className="text-[10px] bg-white border border-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold shadow-sm">{conversation?.members.length}</span>
                      </div>
                      {conversation?.type === 'group' && (
                        <button
                          onClick={() => openModal({
                            title: 'Thêm thành viên vào nhóm',
                            type: 'form',
                            children: (
                              <div className="space-y-4 pt-2">
                                <p className="text-sm text-slate-500">Chọn người dùng để mời vào <span className="font-bold text-slate-800">{conversation?.name}</span></p>
                                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 max-h-[300px] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                                  {MOCK_USERS.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-white group cursor-pointer transition-all">
                                      <div className="flex items-center gap-3">
                                        <img src={user.avatar} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" alt="" />
                                        <div>
                                          <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{user.name}</p>
                                          <p className="text-[10px] text-slate-400">{user.phone}</p>
                                        </div>
                                      </div>
                                      <button className="px-3 py-1 bg-white border border-slate-200 text-blue-600 text-[10px] font-bold rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">Mời</button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ),
                            confirmLabel: 'Hoàn tất',
                            onConfirm: () => console.log('Members Added')
                          })}
                          className="p-2 bg-white border border-slate-200 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-50 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus size={14} /> Thêm
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-slate-50">
                      {conversation?.members.slice(0, 10).map((member: any) => (
                        <div key={member.userId} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{member.name}</p>
                              <p className="text-[10px] text-slate-400">{member.role === 'owner' ? 'Chủ nhóm' : member.role === 'admin' ? 'Phó nhóm' : 'Thành viên'} • {member.joinedAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const user = MOCK_USERS.find(u => u.name === member.name);
                                if (user) {
                                  setSelectedItem(user);
                                  setActiveTab('users');
                                  setViewMode('detail');
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Xem Profile"
                            >
                              <UserCircle size={16} />
                            </button>
                            {conversation?.type === 'group' && member.role !== 'owner' && (
                              <button
                                onClick={() => openModal({
                                  title: 'Kick thành viên?',
                                  children: `Bạn có chắc muốn xóa ${member.name} khỏi nhóm này?`,
                                  confirmLabel: 'Xác nhận Kick',
                                  onConfirm: () => console.log('Kicked', member.userId)
                                })}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Kick Member"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Trang chủ /</span>
                <span className="text-slate-800 font-medium font-bold">Quản lý Cuộc trò chuyện</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Quản lý Cuộc trò chuyện</h1>
              <p className="text-sm text-slate-500">Toàn bộ nhóm chat trên hệ thống</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50/50">
                    <span className="text-slate-400 font-medium">Trạng thái:</span>
                    <select className="bg-transparent font-bold text-slate-700 outline-none">
                      <option>Đang hoạt động</option>
                      <option>Đã giải tán</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm phòng chat..."
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal({
                      title: 'Tạo nhóm trò chuyện mới',
                      type: 'form',
                      children: (
                        <div className="space-y-5 pt-2">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tên nhóm</label>
                            <input
                              type="text"
                              placeholder="Nhập tên nhóm..."
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thêm thành viên</label>
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                              <div className="max-h-[200px] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                                {MOCK_USERS.map((user) => (
                                  <div key={user.id} className="flex items-center justify-between p-3 hover:bg-white transition-colors">
                                    <div className="flex items-center gap-3">
                                      <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                                      <div>
                                        <p className="text-sm font-bold text-slate-700">{user.name}</p>
                                        <p className="text-[10px] text-slate-400">{user.email}</p>
                                      </div>
                                    </div>
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                      confirmLabel: 'Tạo nhóm ngay',
                      onConfirm: () => console.log('Group Created')
                    })}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    <Plus size={18} /> Tạo nhóm mới
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                    <RefreshCw size={16} /> Làm mới
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4 text-left">ID</th>
                      <th className="px-6 py-4 text-left">Tên phòng</th>
                      <th className="px-6 py-4 text-left">Loại phòng</th>
                      <th className="px-6 py-4 text-left">Số thành viên</th>
                      <th className="px-6 py-4 text-left">Ngày tạo</th>
                      <th className="px-6 py-4 text-left">Chủ phòng</th>
                      <th className="px-6 py-4 text-left">Trạng thái</th>
                      <th className="px-6 py-4 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_CONVERSATIONS.map((conv) => (
                      <tr key={conv.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-400">#{conv.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {conv.type === 'direct' ? (
                              <div className="flex -space-x-3">
                                {conv.avatar.map((img, idx) => (
                                  <img key={idx} src={img} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                                ))}
                              </div>
                            ) : (
                              <img src={conv.avatar[0]} alt="" className="w-8 h-8 rounded-full border border-slate-100 object-cover" />
                            )}
                            <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{conv.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                            conv.type === 'group' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                          )}>
                            {conv.type === 'group' ? 'Nhóm' : 'Cá nhân'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-600">{conv.members.length}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{conv.createdAt}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {conv.type === 'group' ? conv.members.find(m => m.role === 'owner')?.name : '--'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={conv.status === 'active' ? 'sent' : 'deleted'}>
                            {conv.status === 'active' ? 'Đang hoạt động' : 'Đã giải tán'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => { setSelectedItem(conv); setViewMode('detail'); }}
                            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      onClick={() => setPostDetailTab(tab)}
                      className={cn(
                        "pb-3 text-sm font-medium transition-colors border-b-2",
                        postDetailTab === tab ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {postDetailTab === 'Chi tiết' && (
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <img src={selectedItem?.media} alt="Post media" className="w-full md:w-1/3 rounded-xl border border-slate-200 shadow-sm" />
                    <div className="flex-1 space-y-4">
                      <div>
                        <h5 className="font-bold text-lg">Tác giả: {selectedItem?.author}</h5>
                        <p className="text-sm text-slate-500">{selectedItem?.date}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 italic">
                        <p className="text-slate-800">"{selectedItem?.content}"</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border border-slate-100 rounded-lg bg-blue-50/50">
                          <p className="text-xs text-slate-400 uppercase font-bold">Thống kê</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm font-bold">👍 {selectedItem?.likes} Likes</span>
                            <span className="text-sm font-bold">💬 {selectedItem?.comments} Comments</span>
                          </div>
                        </div>
                        <div className="p-3 border border-slate-100 rounded-lg bg-orange-50/50">
                          <p className="text-xs text-slate-400 uppercase font-bold">Trạng thái hiện tại</p>
                          <div className="mt-2 text-sm font-bold">
                            <Badge variant={selectedItem?.status === 'Active' ? 'active' : selectedItem?.status === 'Pending' ? 'pending' : 'deleted'}>{selectedItem?.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button
                          onClick={() => openModal({
                            title: 'Xác nhận xóa bài viết?',
                            children: `Hành động này sẽ xóa vĩnh viễn bài bài viết của ${selectedItem?.author}. Bạn có chắc chắn không?`,
                            confirmLabel: 'Xóa bài viết',
                            type: 'danger',
                            onConfirm: () => console.log('Deleted post', selectedItem?.id)
                          })}
                          className="px-6 py-2 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600 transition-colors"
                        >
                          Xóa bài viết
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {postDetailTab === 'Bình luận' && (
                  <div className="space-y-4">
                    <h5 className="font-bold mb-4">Danh sách Bình luận ({MOCK_INTERACTIONS.length})</h5>
                    <div className="overflow-hidden border border-slate-100 rounded-xl">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-6 py-3 text-left font-bold">Người dùng</th>
                            <th className="px-6 py-3 text-left font-bold">Nội dung</th>
                            <th className="px-6 py-3 text-left font-bold">Thời gian</th>
                            <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
                            <th className="px-6 py-3 text-left font-bold text-center">Hành động</th>
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
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-3">

                                  <button
                                    onClick={() => openModal({
                                      title: 'Xóa bình luận?',
                                      children: 'Bạn có chắc chắn muốn xóa bình luận này không?',
                                      confirmLabel: 'Xóa',
                                      type: 'danger',
                                      onConfirm: () => console.log('Deleted comment')
                                    })}
                                    className="text-rose-600 hover:underline"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {postDetailTab === 'Tương tác' && (
                  <div className="space-y-4">
                    <h5 className="font-bold mb-4">Danh sách Tương tác (Likes)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {MOCK_USERS.slice(0, 8).map((user) => (
                        <div key={user.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-blue-50/30 transition-colors">
                          <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                          <div>
                            <p className="font-bold text-sm text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-400">Đã thích vào 02/04 09:30</p>
                          </div>
                          <div className="ml-auto flex gap-1">
                            <div className="w-6 h-6 bg-blue-100 flex items-center justify-center rounded-full text-blue-600">👍</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

                {/* <section>
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
                </section> */}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Hủy đổi
              </button>
              <button
                onClick={() => openModal({
                  title: 'Cập nhật thành công',
                  children: 'Thông tin cài đặt tài khoản của bạn đã được lưu lại trên hệ thống.',
                  type: 'info',
                  confirmLabel: 'Tuyệt vời'
                })}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Lưu Cài đặt
              </button>
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
                      {/* <th className="px-6 py-3 text-left font-bold">IP Address</th> */}
                      <th className="px-6 py-3 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_AUDIT_LOGS.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500">{log.time}</td>
                        <td className="px-6 py-4 font-medium">{log.admin}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase border border-blue-100">{log.action}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{log.target}</td>
                        {/* <td className="px-6 py-4 text-slate-400 font-mono text-xs">{log.ip}</td> */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openModal({
                              title: 'Chi tiết Nhật ký hệ thống',
                              children: (
                                <div className="space-y-4">
                                  <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                      <span className="text-xs text-slate-400 font-bold uppercase">Thời gian</span>
                                      <span className="text-sm font-medium">{log.time}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                      <span className="text-xs text-slate-400 font-bold uppercase">Quản trị viên</span>
                                      <span className="text-sm font-medium">{log.admin}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                      <span className="text-xs text-slate-400 font-bold uppercase">Hành động</span>
                                      <span className="text-sm font-bold text-blue-600">{log.action}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                      <span className="text-xs text-slate-400 font-bold uppercase">Đối tượng</span>
                                      <span className="text-sm font-medium font-mono truncate max-w-[200px]">{log.target}</span>
                                    </div>
                                    {/* <div className="flex justify-between">
                                      <span className="text-xs text-slate-400 font-bold uppercase">Địa chỉ IP</span>
                                      <span className="text-sm font-medium">{log.ip}</span>
                                    </div> */}
                                    <div className="flex justify-between pt-2">
                                      <span className="text-xs text-slate-400 font-bold uppercase">Kết quả</span>
                                      <Badge variant="active">{log.result}</Badge>
                                    </div>
                                  </div>
                                </div>
                              ),
                              confirmLabel: 'Đóng',
                              type: 'info'
                            })}
                            className="text-blue-600 font-medium hover:underline"
                          >
                            Chi tiết
                          </button>
                        </td>
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
              onClick={() => handleTabChange('dashboard')}
            />
          </div>

          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">QUẢN LÝ</p>
            <SidebarItem
              icon={Users}
              label="Người dùng"
              active={activeTab === 'users'}
              onClick={() => handleTabChange('users')}
            />
            <SidebarItem
              icon={MessageSquare}
              label="Nhóm trò chuyện"
              active={activeTab === 'chats'}
              onClick={() => handleTabChange('chats')}
            />
            {/* <SidebarItem
              icon={UserCircle}
              label="Nhóm"
              active={activeTab === 'groups'}
              onClick={() => setActiveTab('groups')}
            /> */}
            <SidebarItem
              icon={FileText}
              label="Bài viết"
              active={activeTab === 'posts'}
              onClick={() => handleTabChange('posts')}
            />
            <SidebarItem
              icon={ImageIcon}
              label="Phương tiện"
              active={activeTab === 'media'}
              onClick={() => handleTabChange('media')}
            />
          </div>
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">HỆ THỐNG</p>

            <SidebarItem
              icon={ShieldCheck}
              label="Phân quyền"
              active={activeTab === 'rbac'}
              onClick={() => handleTabChange('rbac')}
            />

            <SidebarItem
              icon={Settings}
              label="Cấu hình ứng dụng"
              active={activeTab === 'config'}
              onClick={() => handleTabChange('config')}
            />
            <SidebarItem
              icon={FileText}
              label="Audit Logs"
              active={activeTab === 'audit'}
              onClick={() => handleTabChange('audit')}
            />
          </div>
        </div>

        <div className="relative p-4 border-t border-slate-800 bg-slate-900/50">
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-[#1e293b] border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 p-1.5"
              >
                <button
                  onClick={() => {
                    handleTabChange('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  <UserCircle size={16} />
                  Tài khoản cá nhân
                </button>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded-xl transition-all",
              isProfileOpen ? "bg-slate-800" : "hover:bg-slate-800/50"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0 shadow-inner">
              <UserCircle size={24} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold truncate text-slate-200">Super Admin</p>
              <p className="text-[10px] text-slate-500 truncate leading-tight">admin@fbv.app</p>
            </div>
            <ChevronDown
              size={16}
              className={cn("text-slate-500 transition-transform duration-300", isProfileOpen && "rotate-180")}
            />
          </button>
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
            {/* <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
            </button> */}
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
