import type { InputHTMLAttributes } from "react";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`border border-gray-400 rounded-md text-black ${className}`}
      {...props}
    />
  );
}