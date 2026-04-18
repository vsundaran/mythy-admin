import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Star,
  AlertCircle,
} from 'lucide-react';
import * as adminService from '../services/adminService';
import { Button } from '../components/ui/Button';

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<adminService.SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<adminService.SubscriptionPlan | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<adminService.SubscriptionPlan>>({
    planId: '',
    title: '',
    priceDisplay: '',
    numericPrice: 0,
    credits: 0,
    description: '',
    saveTag: '',
    isRecommended: false,
    durationInMonths: 1,
    isActive: true,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getSubscriptionPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (plan?: adminService.SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData(plan);
    } else {
      setEditingPlan(null);
      setFormData({
        planId: '',
        title: '',
        priceDisplay: '',
        numericPrice: 0,
        credits: 0,
        description: '',
        saveTag: '',
        isRecommended: false,
        durationInMonths: 1,
        isActive: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.planId || !formData.title || !formData.priceDisplay || !formData.numericPrice || !formData.durationInMonths) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (editingPlan) {
        await adminService.updateSubscriptionPlan(editingPlan._id, formData);
      } else {
        await adminService.createSubscriptionPlan(formData);
      }
      fetchPlans();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while saving the plan.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      try {
        await adminService.deleteSubscriptionPlan(id);
        fetchPlans();
      } catch (err) {
        console.error('Error deleting plan:', err);
        alert('Failed to delete plan.');
      }
    }
  };

  if (isLoading && plans.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p>Loading plans...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Subscription Plans
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage the packages available for users in the mobile app.
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Add New Plan
        </Button>
      </div>

      <div className="glass" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '1.5rem',
        marginTop: '1rem'
      }}>
        {plans.map((plan) => (
          <div 
            key={plan._id} 
            style={{ 
              background: 'var(--surface)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '1.5rem', 
              border: plan.isRecommended ? '2px solid var(--primary)' : '1px solid var(--border)',
              position: 'relative',
              boxShadow: 'var(--shadow-md)',
              transition: 'transform 0.2s',
            }}
          >
            {plan.isRecommended && (
              <div style={{ 
                position: 'absolute', 
                top: '-12px', 
                left: '20px', 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '20px', 
                fontSize: '0.75rem', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Star size={12} fill="white" />
                RECOMMENDED
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{plan.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ID: {plan.planId}</p>
              </div>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '6px', 
                fontSize: '0.75rem', 
                fontWeight: '600',
                background: plan.isActive ? '#ecfdf5' : '#fef2f2',
                color: plan.isActive ? '#059669' : '#dc2626'
              }}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                {plan.priceDisplay}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {plan.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Internal Price</p>
                <p style={{ fontWeight: '700' }}>₹{(plan.numericPrice).toLocaleString()}</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Duration</p>
                <p style={{ fontWeight: '700' }}>{plan.durationInMonths} Month{plan.durationInMonths > 1 ? 's' : ''}</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Credits</p>
                <p style={{ fontWeight: '700' }}>{(plan.credits || 0).toLocaleString()}</p>
              </div>
              {plan.saveTag && (
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Tag</p>
                  <p style={{ fontWeight: '700', color: '#059669' }}>{plan.saveTag}</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button 
                onClick={() => handleOpenModal(plan)}
                style={{ 
                  background: 'rgba(79, 70, 229, 0.1)', 
                  color: 'var(--primary)', 
                  border: 'none', 
                  padding: '0.5rem', 
                  borderRadius: '10px',
                  cursor: 'pointer' 
                }}
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(plan._id)}
                style={{ 
                  background: 'rgba(220, 38, 38, 0.1)', 
                  color: '#dc2626', 
                  border: 'none', 
                  padding: '0.5rem', 
                  borderRadius: '10px',
                  cursor: 'pointer' 
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {plans.length === 0 && !isLoading && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem' }}>
            <CreditCard size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No plans found</h3>
            <p>Click "Add New Plan" to get started.</p>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass" style={{ 
            width: '100%', 
            maxWidth: '600px', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            padding: '2rem',
            borderRadius: '24px',
            position: 'relative'
          }}>
            <button 
              onClick={handleCloseModal}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              {editingPlan ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Configure the details of this package for the mobile app.
            </p>

            {error && (
              <div style={{ 
                background: '#fef2f2', 
                color: '#991b1b', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Plan ID (system name)</label>
                  <input 
                    type="text" 
                    value={formData.planId} 
                    onChange={e => setFormData({...formData, planId: e.target.value})}
                    placeholder="e.g., 6months_special"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Title (display name)</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., 6 Months"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Price Display Symbol (UI)</label>
                  <input 
                    type="text" 
                    value={formData.priceDisplay} 
                    onChange={e => setFormData({...formData, priceDisplay: e.target.value})}
                    placeholder="e.g., ₹499/month"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Credits</label>
                  <input 
                    type="number" 
                    value={formData.credits} 
                    onChange={e => setFormData({...formData, credits: Number(e.target.value)})}
                    placeholder="e.g., 500000"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Numeric Price (Total ₹)</label>
                  <input 
                    type="number" 
                    value={formData.numericPrice} 
                    onChange={e => setFormData({...formData, numericPrice: Number(e.target.value)})}
                    placeholder="e.g., 2994"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell users what they get..."
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Duration (Months)</label>
                  <input 
                    type="number" 
                    value={formData.durationInMonths} 
                    onChange={e => setFormData({...formData, durationInMonths: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Save Tag (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.saveTag || ''} 
                    onChange={e => setFormData({...formData, saveTag: e.target.value})}
                    placeholder="e.g., SAVE 28%"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isRecommended} 
                    onChange={e => setFormData({...formData, isRecommended: e.target.checked})}
                    style={{ width: '20px', height: '20px' }}
                  />
                  Is Recommended?
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    style={{ width: '20px', height: '20px' }}
                  />
                  Is Active?
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleCloseModal}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  style={{ flex: 1 }}
                >
                  {editingPlan ? 'Save Changes' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .form-group input, .form-group textarea {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--primary);
        }
      `}} />
    </div>
  );
};

export default SubscriptionPlans;
