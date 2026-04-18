import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { 
  Save, 
  RotateCcw, 
  BrainCircuit, 
  Smartphone, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useConfig, useUpdateConfig } from '../hooks/useConfig';

const ConfigEditor: React.FC = () => {
  const { data: response, status, refetch } = useConfig();
  const updateMutation = useUpdateConfig();
  
  const [localConfigs, setLocalConfigs] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Sync local state when query data changes
  useEffect(() => {
    if (response?.data) {
      setLocalConfigs(response.data);
    }
  }, [response]);

  const handleChange = (key: string, value: any) => {
    setLocalConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
  };

  const handleSave = async (key: string) => {
    const config = localConfigs.find(c => c.key === key);
    setMessage('');
    setError('');
    
    updateMutation.mutate({ 
      key, 
      data: { 
        value: config.value,
        description: config.description 
      } 
    }, {
      onSuccess: () => {
        setMessage(`Configuration "${key}" updated successfully!`);
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (err: any) => {
        setError(err.message || `Failed to update configuration "${key}".`);
      }
    });
  };

  const categories = {
    ai: { label: 'AI Settings', icon: BrainCircuit, color: '#6366f1' },
    app: { label: 'App Versioning', icon: Smartphone, color: '#f59e0b' },
    subscription: { label: 'Subscription Pricing', icon: CreditCard, color: '#10b981' },
    other: { label: 'Other Settings', icon: CheckCircle2, color: '#64748b' }
  };

  if (status === 'pending' && localConfigs.length === 0) {
    return (
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
        Loading Configs...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>App Configuration</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your AI model, app versioning, and pricing settings.</p>
        </div>
        <Button variant="secondary" onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RotateCcw size={16} /> Refresh
        </Button>
      </div>

      {message && (
        <div style={{ padding: '1rem', background: '#ecfdf5', color: '#047857', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={20} /> {message}
        </div>
      )}

      {(error || updateMutation.isError) && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} /> {error || (updateMutation.error as any)?.message}
        </div>
      )}

      {Object.entries(categories).map(([catKey, catInfo]) => {
        const catConfigs = localConfigs.filter(c => c.category === catKey);
        if (catConfigs.length === 0) return null;

        return (
          <div key={catKey} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <div style={{ color: catInfo.color }}><catInfo.icon size={24} /></div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{catInfo.label}</h2>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {catConfigs.map(config => (
                <div key={config.key} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{config.key}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{config.description}</p>
                    </div>
                    <Button 
                      onClick={() => handleSave(config.key)} 
                      size="sm" 
                      disabled={updateMutation.isPending}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Save size={14} /> {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>

                  {config.type === 'string' && config.key === 'system_instruction' ? (
                    <textarea 
                      value={config.value}
                      onChange={(e) => handleChange(config.key, e.target.value)}
                      style={{
                        width: '100%',
                        height: '240px',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        background: '#f8fafc',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                    />
                  ) : config.type === 'boolean' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input 
                        type="checkbox" 
                        checked={config.value} 
                        onChange={(e) => handleChange(config.key, e.target.checked)}
                        style={{ width: '20px', height: '20px' }}
                      />
                      <span style={{ fontSize: '0.875rem' }}>{config.value ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  ) : (
                    <input 
                      type={config.type === 'number' ? 'number' : 'text'}
                      value={config.value}
                      onChange={(e) => handleChange(config.key, config.type === 'number' ? Number(e.target.value) : e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        background: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConfigEditor;
