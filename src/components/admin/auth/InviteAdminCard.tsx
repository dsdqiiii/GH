"use client";

import { useState } from "react";
import { UserPlus, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { inviteUserAction } from "@/actions/admin/invite-user";

export function InviteAdminCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await inviteUserAction({}, formData);

      if (res.success && res.message) {
        setFeedback({ type: "success", message: res.message });
        setName("");
        setEmail("");
      } else if (res.error) {
        setFeedback({ type: "error", message: res.error });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Terjadi kesalahan sistem saat mengirim undangan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="flat" className="bg-white">
      <CardHeader className="flex items-center gap-2 border-b pb-4">
        <UserPlus className="h-5 w-5 text-forest" />
        <CardTitle className="text-base font-semibold text-neutral-900">
          Undang Admin Baru
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Feedback Message */}
          {feedback && (
            <div
              className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Nama Lengkap - Opsional */}
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                Nama Lengkap <span className="text-neutral-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nama Admin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            {/* Email - Wajib */}
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {loading ? "Mengirim..." : "Kirim Undangan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}