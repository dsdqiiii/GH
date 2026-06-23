import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({
  className = "",
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={`
        w-full
        rounded-md
        border-black
        px-3
        py-2
        outline-none
        resize-y
        ${className}
      `}
      {...props}
    />
  );
}