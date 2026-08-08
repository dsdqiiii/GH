import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { OrganizationInfoCard } from "@/components/admin/property/OrganizationInfoCard";
import { PropertyEditForm } from "@/components/admin/property/PropertyEditForm";
import { BankAccountsCard } from "@/components/admin/property/BankAccountsCard";
import { PropertyFacilitiesCard } from "@/components/admin/property/PropertyFacilitiesCard";
import { PropertyGalleriesCard } from "@/components/admin/property/PropertyGalleriesCard";
import { Button } from "@/components/ui/core/button";
import { getPropertyDetailBySlug } from "@/services/admin/property-detail";

export const dynamic = "force-dynamic";

export default async function PropertiPage({
  params,
}: {
  params: Promise<{ properti: string }>;
}) {
  const { properti } = await params;
  const detail = await getPropertyDetailBySlug(properti);

  if (!detail) {
    notFound();
  }

  const { property, organization, bankAccounts, facilities, galleries } = detail;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {property.name}
          </h1>
          <p className="text-sm text-neutral-500">
            Kelola data, fasilitas, dan galeri untuk properti ini.
          </p>
        </div>

        <Button
          href={`/admin/manage/${property.slug}/units`}
          variant="secondary"
          className="!px-4 !py-2 text-sm"
        >
          Kelola Unit
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <OrganizationInfoCard organization={organization} />

      <PropertyEditForm property={property} />

      <BankAccountsCard bankAccounts={bankAccounts} />

      <PropertyFacilitiesCard facilities={facilities} />

      <PropertyGalleriesCard galleries={galleries} />
    </div>
  );
}