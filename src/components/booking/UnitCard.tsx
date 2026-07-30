// components/booking/UnitCard.tsx
import Link from "next/link";
import { Button } from "@/components/ui/core/button";

export interface UnitCardData {
  id: string;
  slug: string;
  name: string;
  descriptions?: string | null;
  base_price_per_night: number | string | null;
}

interface SearchQuery {
  checkin?: string;
  checkout?: string;
  adult?: string;
  floor?: string;
  type?: string;
}

interface UnitCardProps {
  propertySlug: string;
  unit: UnitCardData;
  searchQuery?: SearchQuery;
}

export default function UnitCard({ propertySlug, unit, searchQuery }: UnitCardProps) {
  const price = Number(unit.base_price_per_night ?? 0);

  const query = new URLSearchParams();
  if (searchQuery?.checkin) query.set("checkin", searchQuery.checkin);
  if (searchQuery?.checkout) query.set("checkout", searchQuery.checkout);
  if (searchQuery?.adult) query.set("adult", searchQuery.adult);
  if (searchQuery?.type) query.set("type", searchQuery.type);

  const queryString = query.toString();
  const href = `/guesthouse/${propertySlug}/${unit.slug}${queryString ? `?${queryString}` : ""}`;

  return (
    <div className="rounded-2xl border border-sand bg-surface p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-forest">{unit.name}</h3>

          {unit.descriptions && (
            <p className="mt-3 max-w-3xl leading-relaxed text-taupe">
              {unit.descriptions}
            </p>
          )}
        </div>

        <div className="lg:text-right">
          <p className="text-sm text-taupe">Mulai dari</p>
          <p className="mt-1 text-3xl font-bold text-forest">
            Rp {price.toLocaleString("id-ID")}
          </p>
          <p className="mb-4 text-sm text-taupe">/ malam</p>

          <Link href={href}>
            <Button variant="brand" className="w-full lg:w-auto px-8">
              Lihat Kamar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}