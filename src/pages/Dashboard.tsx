import React from 'react';
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useStats } from '../hooks/useStats';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="glass" style={{
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ 
        padding: '0.75rem', 
        background: `${color}15`, 
        color: color, 
        borderRadius: 'var(--radius-md)' 
      }}>
        <Icon size={24} />
      </div>
      {trend && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: trend > 0 ? 'var(--success)' : 'var(--error)',
          padding: '0.25rem 0.5rem',
          background: trend > 0 ? '#ecfdf5' : '#fef2f2',
          borderRadius: 'var(--radius-sm)'
        }}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { data: response, status, error } = useStats();

  if (status === 'pending') {
    return (
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
        Loading Dashboard...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ padding: '2rem', color: 'var(--error)' }}>
        Error loading dashboard: {(error as any)?.message}
      </div>
    );
  }

  const stats = response?.data;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your app metrics and performance in real-time.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          trend={12} 
          color="#6366f1" 
        />
        <StatCard 
          title="Active Chats" 
          value={stats?.totalChats || 0} 
          icon={MessageSquare} 
          trend={8} 
          color="#0ea5e9" 
        />
        <StatCard 
          title="Premium Users" 
          value={stats?.premiumUsers || 0} 
          icon={TrendingUp} 
          trend={5} 
          color="#10b981" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} 
          icon={DollarSign} 
          trend={15} 
          color="#f59e0b" 
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Growth Overview</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 'var(--radius-md)', 
                    border: 'none', 
                    boxShadow: 'var(--shadow-md)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Chat Activity</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 'var(--radius-md)', 
                    border: 'none', 
                    boxShadow: 'var(--shadow-md)' 
                  }} 
                />
                <Bar dataKey="chats" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
