// components/booking/UnitList.tsx
import UnitCard, { type UnitCardData } from "./UnitCard";

interface UnitListProps {
  propertySlug: string;
  units: UnitCardData[];
}

export default function UnitList({ propertySlug, units }: UnitListProps) {
  if (units.length === 0) {
    return <p className="text-taupe">Belum ada kamar tersedia.</p>;
  }

  return (
    <div className="space-y-5">
      {units.map((unit) => (
        <UnitCard key={unit.id} propertySlug={propertySlug} unit={unit} />
      ))}
    </div>
  );
}