import { UserX, LogIn } from "lucide-react";
import Link from "next/link";

export function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col items-center gap-6 p-10 bg-white shadow-2xl rounded-[2.5rem] w-full max-w-lg text-center border border-blue-50">
        
        <div className="bg-blue-50 p-6 rounded-full">
          <UserX className="w-16 h-16 text-blue-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sesi Berakhir</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-blue-500">Error 401: Unauthorized</p>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
          Identitas Anda tidak terverifikasi atau sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.
        </p>

        <div className="w-full pt-4">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-100"
          >
            <LogIn size={18} />
            Login Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}