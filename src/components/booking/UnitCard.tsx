import Link from "next/link";

import { Button } from "@/components/ui/core/button";


interface UnitCardProps {
  propertySlug: string;

  unit: {
    id: string;
    slug: string;
    name: string;

    descriptions?: string | null;

    base_price_per_night:
      | number
      | string
      | null;
  };
}


export default function UnitCard({
  propertySlug,
  unit,
}: UnitCardProps) {

  const price = Number(
    unit.base_price_per_night ?? 0
  );


  return (
    <div
      className="
        rounded-2xl
        border
        p-6
      "
      style={{
        backgroundColor: "#FBF9F4",
        borderColor: "#DDD2C2",
      }}
    >

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
        "
      >

        <div className="flex-1">

          <h3
            className="
              text-2xl
              font-semibold
            "
            style={{
              color: "#1F3B36",
            }}
          >
            {unit.name}
          </h3>


          {unit.descriptions && (
            <p
              className="
                mt-3
                max-w-3xl
                leading-relaxed
              "
              style={{
                color: "#6B5D4F",
              }}
            >
              {unit.descriptions}
            </p>
          )}

        </div>


        <div
          className="
            lg:text-right
          "
        >

          <p
            className="text-sm"
            style={{
              color: "#6B5D4F",
            }}
          >
            Mulai dari
          </p>


          <p
            className="
              mt-1
              text-3xl
              font-bold
            "
            style={{
              color: "#1F3B36",
            }}
          >
            Rp {price.toLocaleString("id-ID")}
          </p>


          <p
            className="
              mb-4
              text-sm
            "
            style={{
              color: "#6B5D4F",
            }}
          >
            / malam
          </p>


          <Link
            href={`/guesthouse/${propertySlug}/${unit.slug}`}
          >
            <Button
              className="
                w-full
                lg:w-auto
                px-8
              "
              style={{
                backgroundColor: "#B5654A",
              }}
            >
              Pilih Kamar
            </Button>
          </Link>

        </div>

      </div>

    </div>
  );
}