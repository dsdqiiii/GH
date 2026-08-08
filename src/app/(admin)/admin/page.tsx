import { LoginForm } from "@/components/admin/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-neutral-900">
            Masuk ke Admin
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Penginapan Darunnajah
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}