import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/card";
import type { PropertyFacility } from "@/lib/types/main.types";

export function PropertyFacilitiesCard({
  facilities,
}: {
  facilities: PropertyFacility[];
}) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Fasilitas</CardTitle>
      </CardHeader>

      <CardContent>
        {facilities.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Belum ada fasilitas yang ditambahkan untuk properti ini.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility) => (
              <span
                key={facility.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700"
              >
                <Sparkles className="h-3.5 w-3.5 text-forest" />
                {facility.facility_name}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}