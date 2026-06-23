"use client";

import { useState } from "react";
import { Label } from "../core/label"; 
import { Input } from "../core/input";
import { Button } from "../core/button";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const EmailInput = ({ label = "Email", ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-2 text-black">
    <Label htmlFor={props.id}>{label}</Label>
    <Input {...props} name="email" type="email" placeholder="email@example.com" className="px-4 py-3 text-base" />
  </div>
);

export function PasswordInput({ label = "Password", ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full text-black">
      {/* Menggunakan komponen Label shared */}
      <Label htmlFor={props.id}>{label}</Label>
      
      <div className="flex items-center gap-2">
        <Input
          name="password"
          type={show ? "text" : "password"} 
          className="w-full px-4 py-3 text-base"
          {...props}  
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => setShow(!show)}
          className="px-4 py-2 text-xs"
        >
          {show ? "Hide" : "Show"}
        </Button>
      </div>
    </div>
  );
};