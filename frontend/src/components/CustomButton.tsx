// frontend/src/components/CustomButton.tsx
import React from 'react';
import Link from 'next/link';

interface CustomButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: React.ReactNode;
  loading?: boolean;
  type?: 'submit' | 'button' | 'reset' | 'link';
  href?: string;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  loading = false,
  type = 'button',
  href,
  icon,
  className,
  ...props
}) => {
  const baseClasses = "flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  const disabledClasses = loading ? "opacity-50 cursor-not-allowed" : "";

  if (type === 'link' && href) {
    return (
      <Link href={href} className={`${baseClasses} text-blue-600 hover:text-blue-800 ${className}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={`${baseClasses} ${className} ${disabledClasses}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="mr-2 animate-spin">🔄</span>}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default CustomButton;