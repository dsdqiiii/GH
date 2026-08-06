// app/admin/(protected)/pembayaran/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPaymentDetailById,
  getPaymentProofSignedUrl,
} from "@/services/admin/payments";
import PaymentActions from "@/components/admin/PaymentAction";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/card";
import { formatCurrency, formatDateTime } from "@/utils/formatter.utils";

export const dynamic = "force-dynamic";

interface AdminPaymentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPaymentDetailPage({
  params,
}: AdminPaymentDetailPageProps) {
  const { id } = await params;
  const payment = await getPaymentDetailById(id);

  if (!payment) {
    notFound();
  }

  const proofSignedUrl = payment.proof_url
    ? await getPaymentProofSignedUrl(payment.proof_url)
    : null;

  return (
    <div className="space-y-6 p-6">
      {/* Header Page & Back Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/pembayaran"
            className="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            &larr; Kembali ke Daftar Pembayaran
          </Link>
          <h1 className="text-xl font-semibold text-neutral-900">
            Verifikasi Pembayaran #{payment.id}
          </h1>
        </div>
        <div>
          <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
            {payment.status}
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* KOLOM KIRI: Bukti Pembayaran */}
        <div className="lg:col-span-5">
          <Card className="p-6 bg-white h-full flex flex-col">
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                <svg
                  className="h-5 w-5 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Bukti Transfer / Pembayaran
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              <div className="relative flex min-h-[350px] flex-1 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-2">
                {proofSignedUrl ? (
                  <a
                    href={proofSignedUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Klik untuk perbesar"
                    className="flex h-full w-full items-center justify-center"
                  >
                    <img
                      src={proofSignedUrl}
                      alt="Bukti Transfer"
                      className="max-h-[500px] w-auto object-contain transition duration-300 hover:scale-105"
                    />
                  </a>
                ) : (
                  <div className="p-6 text-center text-neutral-400">
                    <p className="text-sm">Tidak ada bukti pembayaran diunggah</p>
                  </div>
                )}
              </div>
              <p className="text-center text-xs text-neutral-400">
                * Klik gambar untuk melihat ukuran penuh
              </p>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: Ringkasan & Actions */}
        <div className="space-y-6 lg:col-span-7">
          {/* Tombol Aksi Verifikasi / Reject */}
          <PaymentActions paymentId={payment.id} currentStatus={payment.status} />

          {/* Ringkasan Order */}
          <Card className="p-6 bg-white">
            <CardHeader className="mb-4">
              <CardTitle className="text-base font-semibold text-neutral-900">
                Ringkasan Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-medium text-neutral-500">Order ID</p>
                  <p className="font-semibold text-neutral-800">
                    #{payment.order?.booking_code ?? payment.order_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Nama Pelanggan</p>
                  <p className="font-semibold text-neutral-800">
                    {payment.order?.guest_name ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Total Tagihan Order</p>
                  <p className="font-semibold text-neutral-800">
                    {formatCurrency(payment.order?.total_amount ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Status Order</p>
                  <p className="font-semibold text-indigo-600">
                    {payment.order?.status ?? "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full DB Payments Table */}
          <Card className="p-6 bg-white">
            <CardHeader className="mb-4">
              <CardTitle className="text-base font-semibold text-neutral-900">
                Rincian Data Pembayaran (DB Payments)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-neutral-600">
                  <tbody className="divide-y divide-neutral-100">
                    <tr className="hover:bg-neutral-50">
                      <th className="w-1/3 px-3 py-2.5 font-medium text-neutral-500">
                        ID Pembayaran
                      </th>
                      <td className="px-3 py-2.5 font-mono font-semibold text-neutral-800">
                        {payment.id}
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <th className="px-3 py-2.5 font-medium text-neutral-500">
                        Order ID
                      </th>
                      <td className="px-3 py-2.5 text-neutral-800">
                        {payment.order_id}
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <th className="px-3 py-2.5 font-medium text-neutral-500">
                        Metode Pembayaran
                      </th>
                      <td className="px-3 py-2.5 text-neutral-800">
                        {payment.destination_bank_name} a.n.{" "}
                        {payment.destination_account_holder}
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <th className="px-3 py-2.5 font-medium text-neutral-500">
                        Jumlah Masuk (Amount)
                      </th>
                      <td className="px-3 py-2.5 font-bold text-emerald-600">
                        {formatCurrency(payment.amount)}
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <th className="px-3 py-2.5 font-medium text-neutral-500">
                        Status
                      </th>
                      <td className="px-3 py-2.5">
                        <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <th className="px-3 py-2.5 font-medium text-neutral-500">
                        Catatan / Keterangan
                      </th>
                      <td className="px-3 py-2.5 text-neutral-800">
                        {payment.notes || "-"}
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <th className="px-3 py-2.5 font-medium text-neutral-500">
                        Created At
                      </th>
                      <td className="px-3 py-2.5 text-neutral-800">
                        {formatDateTime(payment.created_at)}
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <th className="px-3 py-2.5 font-medium text-neutral-500">
                        Updated At
                      </th>
                      <td className="px-3 py-2.5 text-neutral-800">
                        {formatDateTime(payment.updated_at)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}