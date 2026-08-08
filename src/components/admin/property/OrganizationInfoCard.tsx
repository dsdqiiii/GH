import { Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";
import type { MasterOrganizations } from "@/lib/types/main.types";

export function OrganizationInfoCard({
  organization,
}: {
  organization: MasterOrganizations | null;
}) {
  if (!organization) {
    return (
      <Card variant="elevated">
        <CardContent>
          <p className="text-sm text-neutral-500">
            Organisasi induk tidak ditemukan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardContent className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Organisasi
            </p>
            <p className="font-semibold text-neutral-900">
              {organization.name}
            </p>
          </div>
        </div>

        <Badge
          size="sm"
          className={
            organization.is_active
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-neutral-200 bg-neutral-100 text-neutral-500"
          }
        >
          {organization.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      </CardContent>
    </Card>
  );
}