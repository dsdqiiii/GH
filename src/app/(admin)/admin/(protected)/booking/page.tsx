import { BookingListTables } from "@/components/admin/BookingListTable";
import { BookingSearch } from "@/components/admin/BookingSearch";
import { getBookings } from "@/services/admin/bookings";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminBookingPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.search ?? "";

  // Ambil data berdasarkan kata kunci search (dengan batas default misal 100 data)
  const bookings = await getBookings({
    search: query,
    limit: 100,
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            Booking
          </h1>
          <p className="text-sm text-neutral-500">
            Menampilkan {bookings.length} booking terbaru.
          </p>
        </div>

        {/* Komponen Search */}
        <BookingSearch />
      </div>

      <div className="space-y-3">
        {/* Komponen Tabel (yang sudah bisa di-scroll) */}
        <BookingListTables bookings={bookings} />
      </div>
    </div>
  );
}