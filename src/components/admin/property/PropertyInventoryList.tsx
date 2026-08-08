import Link from "next/link";
import { Building2, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";
import type { AssignedProperty } from "@/lib/types/main.types";

export function PropertyInventoryList({
  properties,
}: {
  properties: AssignedProperty[];
}) {
  if (properties.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
        Belum ada properti yang di-assign ke akun Anda. Hubungi administrator
        untuk mendapatkan akses.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Link key={property.assignment_id} href={`/admin/manage/${property.slug}`}>
          <Card
            variant="elevated"
            className="h-full transition hover:border-forest/40 hover:shadow-[0_4px_16px_rgba(31,59,54,0.12)]"
          >
            <CardContent className="flex h-full flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 shrink-0 text-forest" />
                  <h3 className="font-semibold text-neutral-900">
                    {property.name}
                  </h3>
                </div>
                <Badge
                  size="sm"
                  className={
                    property.is_active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-neutral-200 bg-neutral-100 text-neutral-500"
                  }
                >
                  {property.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>

              {property.address && (
                <div className="flex items-start gap-2 text-sm text-neutral-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="line-clamp-2">{property.address}</span>
                </div>
              )}

              {property.contact_wa && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{property.contact_wa}</span>
                </div>
              )}

              <div className="mt-auto pt-2 text-xs text-neutral-400">
                Kelola unit &amp; inventaris &rarr;
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}