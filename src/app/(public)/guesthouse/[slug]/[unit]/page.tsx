import { notFound, redirect } from "next/navigation";

import { Card } from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";
import { PageShell } from "@/components/ui/layout/PageShell";
import { PageHeader } from "@/components/ui/layout/PageHeader";

import { getUnitBySlug } from "@/services/unit";
import { getPropertyBySlug } from "@/services/property";
import { getUnitImagesByUnitId } from "@/services/images";
import { getUnitFacilities } from "@/services/facility";
import { getPropertyAddons } from "@/services/addons";
import { getAvailableUnits, type TypeBooking } from "@/services/availablility";

import PropertyGallery from "@/components/landing/PropertyGallery";
import PickRange from "@/components/booking/PickRange";
import BookingForm from "@/components/booking/BookingForm";

import { formatCurrency } from "@/utils/formatter.utils";

export default async function UnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; unit: string }>;
  searchParams: Promise<{
    checkin?: string;
    duration?: string;
    adult?: string;
    floor?: string;
    type?: TypeBooking;
  }>;
}) {
  const { slug, unit: unitSlug } = await params;
  const sp = await searchParams;

  const [property, unit] = await Promise.all([
    getPropertyBySlug(slug),
    getUnitBySlug(unitSlug),
  ]);

  if (!property || !unit) {
    return notFound();
  }

  const hasDateRange = Boolean(sp.checkin && sp.duration);

  // Re-validasi ketersediaan unit jika ada filter tanggal
  if (hasDateRange) {
    const availableUnits = await getAvailableUnits({
      propertyId: property.id,
      checkIn: sp.checkin!,
      duration: Number(sp.duration),
      typeBooking: sp.type ?? "inap",
    });

    const stillAvailable = availableUnits.some((u) => u.id === unit.id);

    if (!stillAvailable) {
      const urlParams = new URLSearchParams();
      urlParams.set("checkin", sp.checkin!);
      urlParams.set("duration", sp.duration!);
      if (sp.adult) urlParams.set("adult", sp.adult);
      if (sp.type) urlParams.set("type", sp.type);

      redirect(`/guesthouse/${slug}?${urlParams.toString()}`);
    }
  }

  const [images, facilities, addons] = await Promise.all([
    getUnitImagesByUnitId(unit.id),
    getUnitFacilities(unit.id),
    getPropertyAddons(property.id),
  ]);

  const pricePerNight = Number(unit.base_price_per_night ?? 0);

  return (
    <PageShell>
      {/* Container Utama */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 sm:space-y-10">

        {/* Header */}
        <section>
          <PageHeader eyebrow={property.name} title={unit.name} />
        </section>

        {/* Top Hero Section: Galeri (Kiri) & Sticky PickRange (Kanan) */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-6 xl:gap-8 items-start">

          {/* Main Content Kiri: Galeri Foto */}
          <div className="w-full min-w-0">
            <PropertyGallery images={images} alt={unit.name} />
          </div>

          {/* Sidebar Kanan: PickRange & Card Ringkasan Harga (Selalu Tampil) */}
          <aside className="w-full lg:sticky lg:top-6 space-y-4">
            <PickRange />

            <Card variant="elevated">
              <p className="text-xs sm:text-sm text-taupe font-medium">
                Harga per malam
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-forest">
                {formatCurrency(pricePerNight)}
              </p>
              <p className="mt-3 text-xs sm:text-sm text-taupe leading-relaxed">
                {hasDateRange
                  ? "Tanggal dipilih! Gulir ke bawah untuk melengkapi formulir pemesanan."
                  : "Pilih tanggal menginap di atas untuk melihat ketersediaan & memesan kamar ini."}
              </p>
            </Card>
          </aside>
        </section>

        {/* Bottom Section: Informasi Detail & Form Booking */}
        <section className="border-t border-sand/60 pt-8 sm:pt-10 pb-12 space-y-10">

          {/* Deskripsi & Fasilitas Kamar */}
          {(unit.descriptions || facilities.length > 0) && (
            <div className="max-w-4xl space-y-8">
              {/* Deskripsi Unit */}
              {unit.descriptions && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-forest">
                    Tentang Kamar
                  </h2>
                  <p className="leading-relaxed text-sm sm:text-base text-ink">
                    {unit.descriptions}
                  </p>
                </div>
              )}

              {/* Fasilitas Unit */}
              {facilities.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-forest">
                    Fasilitas Kamar
                  </h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {facilities.map((facility) => (
                      <Badge key={facility.id}>{facility.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Booking (Hanya Tampil Jika Tanggal Sudah Dipilih) */}
          {hasDateRange && (
            <div className="max-w-4xl border-t border-sand/60 pt-8">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-forest">
                Formulir Pemesanan
              </h2>
              <BookingForm
                unitId={unit.id}
                unitName={unit.name}
                pricePerNight={pricePerNight}
                pricePerHour={unit.price_per_hour}
                isTransitEnabled={unit.is_transit_enabled}
                addons={addons}
                isLoggedIn={false}
                checkIn={sp.checkin!}
                duration={Number(sp.duration)}
                bookingType={sp.type ?? "inap"}
              />
            </div>
          )}

        </section>

      </div>
    </PageShell>
  );
}