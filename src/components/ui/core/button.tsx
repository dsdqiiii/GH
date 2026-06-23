// packages/ui/src/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  // 💡 1. Tambahkan 'ghost' ke dalam opsi tipe variant
  variant?: "primary" | "secondary" | "danger" | "ghost"; 
  // 💡 2. Opsional: Tambahkan properti isLoading agar tombol bisa memunculkan status loading otomatis
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  
  // 💡 3. Pisahkan gaya dasar tombol agar tidak menumpuk di tag return
  const baseStyles = "px-6 py-3 rounded-2xl font-medium transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  // 💡 4. Definisikan gaya untuk varian 'ghost'
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100",
    secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 shadow-none", // ✨ Varian hantu kita!
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading} // Otomatis disabled jika sedang loading
      {...props}
    >
      {/* 💡 5. Jika sedang loading, teks bisa otomatis menyesuaikan atau ditambah spinner nanti */}
      {isLoading ? (
        <>
          <span className="opacity-70">Memproses...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}