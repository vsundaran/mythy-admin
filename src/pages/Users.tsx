import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Calendar, 
  ChevronDown,
  Mail,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { useUsers } from '../hooks/useUsers';

const Users: React.FC = () => {
  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);

  // Use TanStack Query Hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useUsers({
    search: debouncedSearch,
    startDate,
    endDate,
  });

  // Flatten users from all pages
  const users = useMemo(() => {
    return data?.pages.flatMap(page => page.data.users) || [];
  }, [data]);

  const totalCount = data?.pages[0]?.data.totalCount || 0;

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback((node: HTMLTableRowElement) => {
    if (status === 'pending' || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [status, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'error') {
    return <div style={{ padding: '2rem', color: 'var(--error)' }}>Error fetching users: {(error as any)?.message}</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
            App Users
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Manage and monitor your application's user base. Total: <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{totalCount}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              style={{
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                width: '160px'
              }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              style={{
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                width: '160px'
              }}
            />
          </div>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      <div className="glass" style={{ 
        borderRadius: 'var(--radius-lg)', 
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(248, 250, 252, 0.5)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>User</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Joined Date</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user._id} 
                ref={index === users.length - 1 ? lastUserElementRef : null}
                style={{ 
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}
                className="hover:bg-slate-50/50"
              >
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const sibling = target.nextElementSibling as HTMLElement;
                            if (sibling) sibling.style.display = 'flex';
                          }}
                          style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }}
                        />
                      ) : null}
                      {(!user.avatar || user.avatar) && (
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '14px', 
                          background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
                          display: 'flex',
                          alignItems: !user.avatar ? 'center' : 'none',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '1.125rem',
                          display: !user.avatar ? 'flex' : 'none'
                        }}>
                          {user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      {user.isPremium && (
                        <div style={{ 
                          position: 'absolute', 
                          bottom: '-4px', 
                          right: '-4px', 
                          background: '#f59e0b', 
                          color: 'white', 
                          padding: '2px', 
                          borderRadius: '50%',
                          border: '2px solid white',
                          width:"24px",
                          height:"24px",
                          display:"flex",
                          justifyContent:"center",
                          alignItems:'center'

                        }}>
                          <ChevronDown size={10} style={{ transform: 'rotate(180deg)' }} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>{user.name}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ 
                    padding: '0.375rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    background: user.isPremium ? '#ecfdf5' : '#f1f5f9',
                    color: user.isPremium ? '#059669' : '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                    {user.isPremium ? 'Premium' : 'Free'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <Clock size={14} />
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <button style={{ 
                    padding: '0.5rem', 
                    borderRadius: 'var(--radius-md)', 
                    color: 'var(--text-muted)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }} className="hover:text-primary hover:bg-slate-100">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(status === 'pending' || isFetchingNextPage) && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #f3f3f3', 
              borderTop: '3px solid var(--primary)', 
              borderRadius: '50%', 
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Fetching users...</p>
          </div>
        )}

        {status === 'success' && users.length === 0 && (
          <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: '#f8fafc', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--text-muted)'
            }}>
              <UsersIcon size={40} />
            </div>
            <h3 style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No users found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
          </div>
        )}

        {!hasNextPage && users.length > 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', borderTop: '1px solid var(--border)' }}>
            You've reached the end of the list.
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Users;
