import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  // Vanilla CSS equivalents for the styles since we aren't using Tailwind
  const customStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    transition: 'all 0.2s',
    borderRadius: 'var(--radius-md)',
    cursor: props.disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: props.disabled || isLoading ? 0.6 : 1,
    padding: size === 'sm' ? '0.5rem 1rem' : size === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem',
    fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
    backgroundColor: variant === 'primary' ? 'var(--primary)' : variant === 'danger' ? 'var(--error)' : variant === 'secondary' ? 'var(--surface)' : 'transparent',
    color: variant === 'ghost' ? 'var(--text-secondary)' : variant === 'secondary' ? 'var(--text-primary)' : 'white',
    border: variant === 'secondary' ? '1px solid var(--border)' : 'none',
    boxShadow: 'var(--shadow-sm)'
  };

  return (
    <button 
      style={customStyles}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="spinner" style={{ marginRight: '8px' }}>...</span>
      ) : null}
      {children}
    </button>
  );
};
