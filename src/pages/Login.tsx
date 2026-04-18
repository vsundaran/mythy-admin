import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const loginMutation = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate({ email, password }, {
      onSuccess: (response) => {
        if (response.success) {
          localStorage.setItem('admin_token', response.data.accessToken);
          localStorage.setItem('admin_user', JSON.stringify(response.data.user));
          navigate('/dashboard');
        }
      }
    });
  };

  const error = (loginMutation.error as any)?.message;

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)'
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '1rem', 
            background: 'var(--primary)', 
            borderRadius: '50%',
            color: 'white',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Welcome back, sign in to continue</p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem', 
            background: '#fee2e2', 
            color: '#b91c1c', 
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vsundaran77@gmail.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.925rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.925rem'
                }}
              />
            </div>
          </div>

          <Button type="submit" isLoading={loginMutation.isPending} style={{ width: '100%' }}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
