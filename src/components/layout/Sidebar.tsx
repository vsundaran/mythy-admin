import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Settings, 
  Users, 
  MessageSquare, 
  LogOut, 
  ShieldCheck,
  Smartphone,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Import api inside or at the top
      const { default: api } = await import('../../services/api');
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'App Config', path: '/configs', icon: Settings },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Chats', path: '/chats', icon: MessageSquare },
    { name: 'Subscription Plans', path: '/subscription-plans', icon: CreditCard },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10
    }}>
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'white' }}>
          <ShieldCheck size={24} />
        </div>
        <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Mythy Admin</span>
      </div>

      <nav style={{ flex: 1, padding: '1rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '0.5rem',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? '#f0f4ff' : 'transparent',
              fontWeight: isActive ? '600' : '500',
              transition: 'all 0.2s'
            })}
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: '#e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-secondary)'
          }}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '600', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin'}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email || 'admin@mythy.com'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.625rem',
            color: '#b91c1c',
            fontSize: '0.875rem',
            fontWeight: '500',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.2s'
          }}
          className="hover:bg-red-50"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
