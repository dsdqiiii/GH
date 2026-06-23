import { Label } from "../core/label"; 
import { Input } from "../core/input";

export const TextInput = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-2 text-black w-full">
    <Label htmlFor={props.id}>{label}</Label>
    <Input {...props} className="w-full px-4 py-3" />
  </div>
);