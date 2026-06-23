import type { LabelHTMLAttributes } from "react";

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label(props: LabelProps) {
  return <label {...props} />;
}