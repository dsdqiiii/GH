"use client";

import UnitCard from "@/components/booking/UnitCard";

import type { Units } from "@/lib/types/main";


interface UnitAvailabilityProps {
  propertySlug: string;
  units: Units[];
}


export default function UnitAvailability({
  propertySlug,
  units,
}: UnitAvailabilityProps) {

  return (
    <div className="space-y-5">

      {units.length === 0 ? (

        <p
          style={{
            color: "#6B5D4F",
          }}
        >
          Belum ada kamar tersedia.
        </p>

      ) : (

        units.map((unit) => (
          <UnitCard
            key={unit.id}
            propertySlug={propertySlug}
            unit={unit}
          />
        ))

      )}

    </div>
  );
}