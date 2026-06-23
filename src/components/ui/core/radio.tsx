import type { InputHTMLAttributes } from "react";

export interface RadioProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export function Radio({
  className = "",
  ...props
}: RadioProps) {
  return (
    <input
      type="radio"
      className={className}
      {...props}
    />
  );
}