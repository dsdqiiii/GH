import Link from "next/link";
import { ChevronRight, BedDouble } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import { formatCurrency } from "@/utils/formatter.utils";
import type { Units } from "@/lib/types/main.types";

export function UnitListTable({
  units,
  propertySlug,
}: {
  units: Units[];
  propertySlug: string;
}) {
  if (units.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
        <BedDouble className="h-6 w-6 text-neutral-300" />
        Belum ada unit untuk properti ini.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-neutral-200 bg-white">
      <Table className="text-sm">
        <TableHead className="bg-neutral-50">
          <TableRow className="border-b border-neutral-200 text-left text-neutral-500">
            <TableHeader className="px-4 py-3 font-medium">Nama Unit</TableHeader>
            <TableHeader className="px-4 py-3 font-medium">Tipe</TableHeader>
            <TableHeader className="px-4 py-3 font-medium">Harga / Malam</TableHeader>
            <TableHeader className="px-4 py-3 font-medium">Harga / Jam</TableHeader>
            <TableHeader className="px-4 py-3 font-medium">Kapasitas</TableHeader>
            <TableHeader className="px-4 py-3 font-medium">Status</TableHeader>
            <TableHeader className="px-4 py-3 font-medium text-right">Aksi</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {units.map((unit) => (
            <TableRow
              key={unit.id}
              className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60"
            >
              <TableCell className="px-4 py-3">
                <div className="font-medium text-neutral-900">{unit.name}</div>
                {unit.floor && (
                  <div className="text-xs text-neutral-400">Lantai {unit.floor}</div>
                )}
              </TableCell>

              <TableCell className="px-4 py-3">
                <span className="inline-flex rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                  {unit.unit_type}
                </span>
                {unit.is_transit_enabled && (
                  <span className="ml-1.5 inline-flex rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    Transit
                  </span>
                )}
              </TableCell>

              <TableCell className="px-4 py-3 text-neutral-700">
                {formatCurrency(unit.base_price_per_night)}
              </TableCell>

              <TableCell className="px-4 py-3 text-neutral-700">
                {unit.price_per_hour ? formatCurrency(unit.price_per_hour) : "-"}
              </TableCell>

              <TableCell className="px-4 py-3 text-neutral-700">
                {unit.capacity} tamu
              </TableCell>

              <TableCell className="px-4 py-3">
                <Badge
                  size="sm"
                  className={
                    unit.is_active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-neutral-200 bg-neutral-100 text-neutral-500"
                  }
                >
                  {unit.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>

              <TableCell className="px-4 py-3 text-right">
                <Button
                  href={`/admin/manage/${propertySlug}/units/${unit.slug}`}
                  variant="ghost"
                  className="!px-3 !py-1.5 text-xs"
                >
                  Detail
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}