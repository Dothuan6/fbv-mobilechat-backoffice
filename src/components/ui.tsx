import React from 'react';
import { cn } from '../lib/utils';
import { AlertTriangle, X, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Badge ───────────────────────────────────────────────────────────────────
export const Badge = ({ children, variant }: { children: React.ReactNode; variant?: string }) => {
  const variants: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    deleted: 'bg-rose-100 text-rose-700',
    suspended: 'bg-slate-100 text-slate-700',
    inactive: 'bg-slate-100 text-slate-600',
    failed: 'bg-rose-100 text-rose-700',
    sent: 'bg-emerald-100 text-emerald-700',
    flagged: 'bg-orange-100 text-orange-700',
    'bị cấm': 'bg-rose-100 text-rose-700',
    'hoạt động': 'bg-emerald-100 text-emerald-700',
    'đình chỉ': 'bg-slate-100 text-slate-700',
    'chờ xác nhận': 'bg-amber-100 text-amber-700',
    'đã giải tán': 'bg-rose-100 text-rose-700',
    success: 'bg-emerald-100 text-emerald-700',
  };
  const key = variant?.toLowerCase() ?? '';
  return (
    <span className={cn('px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', variants[key] ?? 'bg-slate-100 text-slate-600')}>
      {children}
    </span>
  );
};

// ─── Confirm / Alert Modal ────────────────────────────────────────────────────
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal = ({ isOpen, onClose, title, children, confirmLabel = 'Xác nhận', onConfirm, type = 'danger' }: ConfirmModalProps) => {
  if (!isOpen) return null;
  const iconMap = {
    danger: { icon: AlertTriangle, bg: 'bg-rose-100', text: 'text-rose-600', btn: 'bg-rose-500 hover:bg-rose-600' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-100', text: 'text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600' },
    info: { icon: Info, bg: 'bg-blue-100', text: 'text-blue-600', btn: 'bg-blue-500 hover:bg-blue-600' },
  };
  const { icon: Icon, bg, text, btn } = iconMap[type];
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className={cn('p-3 rounded-full', bg, text)}><Icon size={32} /></div>
          </div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <div className="text-slate-500 text-sm mb-6">{children}</div>
          <div className="flex gap-3 justify-center">
            <button onClick={onClose} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors">Hủy</button>
            <button onClick={() => { onConfirm?.(); onClose(); }} className={cn('px-6 py-2.5 text-white rounded-xl font-medium transition-colors', btn)}>{confirmLabel}</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Form / Sheet Modal ───────────────────────────────────────────────────────
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  wide?: boolean;
}

export const FormModal = ({ isOpen, onClose, title, children, onSubmit, submitLabel = 'Lưu thay đổi', wide }: FormModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn('bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col max-h-[90vh]', wide ? 'max-w-2xl' : 'max-w-lg')}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold">{title}</h3>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><X size={18} /></button>
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">{children}</div>
          {/* Footer */}
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button onClick={onClose} className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">Hủy</button>
            <button onClick={() => { onSubmit?.(); onClose(); }} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <CheckCircle2 size={16} /> {submitLabel}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── Form Field helpers ───────────────────────────────────────────────────────
export const Field = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700">{label}{required && <span className="text-rose-500 ml-0.5">*</span>}</label>
    {children}
  </div>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={cn('w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white transition', props.className)} />
);

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={cn('w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white transition', props.className)} />
);

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={cn('w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white resize-none transition', props.className)} />
);

// ─── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, message }: { icon: React.ElementType; message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-300">
    <Icon size={56} strokeWidth={1} className="mb-3" />
    <p className="text-sm text-slate-400">{message}</p>
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
export const Pagination = ({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) => {
  const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-40 transition">‹</button>
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)} className={cn('w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition', p === current ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-white')}>{p}</button>
      ))}
      {total > 5 && <span className="px-2 text-slate-400 text-sm">...</span>}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-40 transition">›</button>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, trend, trendUp, color, icon: Icon }: { label: string; value: string | number; trend: string; trendUp?: boolean; color: string; icon: React.ElementType }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
        <p className={cn('text-xs mt-2 font-semibold', trendUp !== false && !trend.startsWith('-') ? 'text-emerald-500' : 'text-rose-500')}>
          {trend} so với hôm qua
        </p>
      </div>
      <div className={cn('p-3 rounded-xl', color)}><Icon size={24} className="text-white" /></div>
    </div>
  </div>
);

// ─── Page Header ─────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

// ─── Action Button ────────────────────────────────────────────────────────────
export const Btn = ({ children, variant = 'secondary', onClick, icon: Icon, className }: { children?: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger' | 'success'; onClick?: () => void; icon?: React.ElementType; className?: string }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  };
  return (
    <button onClick={onClick} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors', styles[variant], className)}>
      {Icon && <Icon size={15} />}{children}
    </button>
  );
};
