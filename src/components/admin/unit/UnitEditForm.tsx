"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import { Textarea } from "@/components/ui/core/textarea";
import { Label } from "@/components/ui/core/label";
import { Checkbox } from "@/components/ui/core/checkbox";
import { Button } from "@/components/ui/core/button";
import { toggleUnitActiveAction, updateUnitAction } from "@/actions/admin/unit";
import type { Units } from "@/lib/types/main.types";

const UNIT_TYPE_OPTIONS = ["Standard", "VIP", "Jamaah"] as const;

export function UnitEditForm({
  unit,
  propertySlug,
}: {
  unit: Units;
  propertySlug: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isTogglePending, startToggleTransition] = useTransition();

  const [form, setForm] = useState({
    name: unit.name,
    slug: unit.slug,
    unit_type: unit.unit_type,
    floor: unit.floor ?? "",
    capacity: String(unit.capacity),
    base_price_per_night: String(unit.base_price_per_night),
    price_per_hour: unit.price_per_hour !== null ? String(unit.price_per_hour) : "",
    is_transit_enabled: unit.is_transit_enabled,
    descriptions: unit.descriptions ?? "",
    details: unit.details ?? "",
  });
  const [isActive, setIsActive] = useState(unit.is_active);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function handleTextChange(
    field: "name" | "slug" | "floor" | "capacity" | "base_price_per_night" | "price_per_hour" | "descriptions" | "details"
  ): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSave() {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!form.name.trim() || !form.slug.trim()) {
      setErrorMsg("Nama dan slug wajib diisi");
      return;
    }

    const capacity = Number(form.capacity);
    const basePricePerNight = Number(form.base_price_per_night);
    const pricePerHour = form.price_per_hour.trim() === "" ? null : Number(form.price_per_hour);

    if (!Number.isFinite(capacity) || capacity <= 0) {
      setErrorMsg("Kapasitas harus lebih dari 0");
      return;
    }

    if (!Number.isFinite(basePricePerNight) || basePricePerNight < 0) {
      setErrorMsg("Harga per malam tidak valid");
      return;
    }

    if (pricePerHour !== null && (!Number.isFinite(pricePerHour) || pricePerHour < 0)) {
      setErrorMsg("Harga per jam tidak valid");
      return;
    }

    if (form.is_transit_enabled && pricePerHour === null) {
      setErrorMsg("Harga per jam wajib diisi jika transit diaktifkan");
      return;
    }

    startTransition(async () => {
      const res = await updateUnitAction(unit.id, propertySlug, unit.slug, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        unit_type: form.unit_type,
        floor: form.floor.trim() || null,
        capacity,
        base_price_per_night: basePricePerNight,
        price_per_hour: pricePerHour,
        is_transit_enabled: form.is_transit_enabled,
        descriptions: form.descriptions.trim() || null,
        details: form.details.trim() || null,
      });

      if (res.error || !res.data) {
        setErrorMsg(res.error ?? "Gagal memperbarui unit");
        return;
      }

      setSuccessMsg("Perubahan tersimpan");
      router.refresh();

      // Kalau slug berubah, URL halaman ini ikut berubah
      if (res.data.slug !== unit.slug) {
        router.replace(`/admin/manage/${propertySlug}/units/${res.data.slug}`);
      }
    });
  }

  function handleToggleActive() {
    const nextValue = !isActive;
    const confirmText = nextValue
      ? "Aktifkan kembali unit ini?"
      : "Nonaktifkan unit ini? Unit tidak akan tampil di pencarian publik.";

    if (!confirm(confirmText)) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    startToggleTransition(async () => {
      const res = await toggleUnitActiveAction(
        unit.id,
        propertySlug,
        unit.slug,
        nextValue
      );

      if (res.error) {
        setErrorMsg(res.error);
        return;
      }

      setIsActive(nextValue);
      router.refresh();
    });
  }

  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Data Unit</CardTitle>
        <Button
          variant={isActive ? "danger" : "primary"}
          isLoading={isTogglePending}
          onClick={handleToggleActive}
          className="!px-4 !py-2 text-sm"
        >
          {isActive ? "Nonaktifkan" : "Aktifkan"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMsg && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600">
            {errorMsg}
          </p>
        )}
        {successMsg && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">
            {successMsg}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Unit</Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleTextChange("name")}
              className="w-full px-3 py-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={handleTextChange("slug")}
              className="w-full px-3 py-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="unit_type">Tipe Unit</Label>
            <select
              id="unit_type"
              value={form.unit_type}
              onChange={(e) => setForm((prev) => ({ ...prev, unit_type: e.target.value }))}
              className="w-full rounded-md border border-gray-400 px-3 py-2 text-black"
            >
              {UNIT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="floor">Lantai</Label>
            <Input
              id="floor"
              value={form.floor}
              onChange={handleTextChange("floor")}
              className="w-full px-3 py-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="capacity">Kapasitas (tamu)</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              value={form.capacity}
              onChange={handleTextChange("capacity")}
              className="w-full px-3 py-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="base_price_per_night">Harga per Malam (Rp)</Label>
            <Input
              id="base_price_per_night"
              type="number"
              min={0}
              value={form.base_price_per_night}
              onChange={handleTextChange("base_price_per_night")}
              className="w-full px-3 py-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price_per_hour">Harga per Jam / Transit (Rp)</Label>
            <Input
              id="price_per_hour"
              type="number"
              min={0}
              value={form.price_per_hour}
              onChange={handleTextChange("price_per_hour")}
              className="w-full px-3 py-2"
              placeholder="Kosongkan jika tidak menerima transit"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="is_transit_enabled"
              checked={form.is_transit_enabled}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, is_transit_enabled: e.target.checked }))
              }
            />
            <Label htmlFor="is_transit_enabled" className="cursor-pointer">
              Unit ini menerima booking transit
            </Label>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="descriptions">Deskripsi</Label>
          <Textarea
            id="descriptions"
            value={form.descriptions}
            onChange={handleTextChange("descriptions")}
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="details">Detail Tambahan</Label>
          <Textarea
            id="details"
            value={form.details}
            onChange={handleTextChange("details")}
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            isLoading={isPending}
            className="!px-6 !py-2.5 text-sm"
          >
            Simpan Perubahan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}