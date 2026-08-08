import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";
import type { MasterProperties } from "@/lib/types/main.types";

export function UnitPropertyInfoCard({
  property,
}: {
  property: MasterProperties;
}) {
  return (
    <Link href={`/admin/manage/${property.slug}`} className="block">
      <Card
        variant="elevated"
        className="flex items-center justify-between gap-3 transition hover:border-forest/40"
      >
        <CardContent className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Properti
              </p>
              <p className="font-semibold text-neutral-900">{property.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}