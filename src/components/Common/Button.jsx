// src\components\Common\Button.jsx

import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600",
    secondary:
      "bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:hover:bg-slate-200",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600",
    success:
      "bg-green-600 text-white hover:bg-green-700 disabled:hover:bg-green-600",
    outline:
      "border-2 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:hover:bg-transparent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
      {children}
    </button>
  );
};

export default Button;
