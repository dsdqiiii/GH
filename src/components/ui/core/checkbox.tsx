import type { InputHTMLAttributes } from "react";

export interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export function Checkbox({
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={className}
      {...props}
    />
  );
}