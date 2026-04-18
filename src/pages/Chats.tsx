import React from 'react';
import { 
  MessageSquare, 
  ExternalLink, 
  Clock, 
  Hash,
  User as UserIcon
} from 'lucide-react';
import { useChats } from '../hooks/useChats';

const Chats: React.FC = () => {
  const { data: response, status, error } = useChats();

  if (status === 'pending') {
    return (
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
        Loading Chats...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ padding: '2rem', color: 'var(--error)' }}>
        Error loading chats: {(error as any)?.message}
      </div>
    );
  }

  const chats = response?.data?.chats || [];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>Chat Room Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of all AI chat sessions across the platform.</p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {chats.map((chat: any) => (
          <div key={chat._id} className="glass" style={{ 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1 }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: '#f0f4ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <MessageSquare size={24} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)' }}>{chat.title}</h4>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.1rem 0.5rem', 
                    background: 'var(--background)', 
                    borderRadius: '4px', 
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Hash size={10} /> {chat.chatId.substring(0, 8)}...
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <UserIcon size={14} />
                    <span>{chat.user?.name || 'Unknown User'}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({chat.user?.email || 'N/A'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Clock size={14} />
                    <span>{new Date(chat.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{chat.messageCount}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Messages</p>
              </div>
              <button style={{ 
                padding: '0.5rem', 
                borderRadius: 'var(--radius-sm)', 
                background: 'var(--surface-hover)', 
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }}>
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}

        {chats.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass">
            <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>No chat records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
