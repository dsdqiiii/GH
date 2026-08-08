import { PaymentListTable } from "@/components/admin/payment/PaymentListTable"; // Sesuaikan path komponen Anda
import { PaymentSearch } from "@/components/admin/payment/PaymentSearch"; // Sesuaikan path komponen Anda
import { getPaymentSummaries, getPaymentProofSignedUrl } from "@/services/admin/payments";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminPembayaranPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.search ?? "";

  // 1. Fetch data pembayaran
  const rawPayments = await getPaymentSummaries();

  // 2. Generate signed URL untuk setiap bukti pembayaran
  const payments = await Promise.all(
    rawPayments.map(async (payment) => {
      if (payment.proof_url) {
        const signedUrl = await getPaymentProofSignedUrl(payment.proof_url);
        return { ...payment, signedUrl };
      }
      return { ...payment, signedUrl: null };
    })
  );

  // 3. Filter berdasarkan pencarian jika query diisi (Opsional di Client/Server side)
  const filteredPayments = query
    ? payments.filter((payment) =>
        payment.order_id?.toLowerCase().includes(query.toLowerCase()) ||
        payment.status?.toLowerCase().includes(query.toLowerCase())
      )
    : payments;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            Pembayaran
          </h1>
          <p className="text-sm text-neutral-500">
            Menampilkan {filteredPayments.length} pembayaran terbaru.
          </p>
        </div>

        {/* Komponen Search */}
        <PaymentSearch />
      </div>

      <div className="space-y-3">
        {/* Komponen Tabel Pembayaran */}
        <PaymentListTable payments={filteredPayments} />
      </div>
    </div>
  );
}