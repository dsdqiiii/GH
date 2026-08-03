// components/booking/UnitList.tsx
import UnitCard, { type UnitCardData } from "./UnitCard";

interface SearchQuery {
  checkin?: string;
  duration?: string;
  adult?: string;
  floor?: string;
  type?: string;
}

interface UnitListProps {
  propertySlug: string;
  units: UnitCardData[];
  searchQuery?: SearchQuery;
}

export default function UnitList({ propertySlug, units, searchQuery }: UnitListProps) {
  if (units.length === 0) {
    return <p className="text-taupe">Belum ada kamar tersedia.</p>;
  }

  return (
    <div className="space-y-5">
      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          propertySlug={propertySlug}
          unit={unit}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}