"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import { Textarea } from "@/components/ui/core/textarea";
import { Label } from "@/components/ui/core/label";
import { Button } from "@/components/ui/core/button";
import {
  togglePropertyActiveAction,
  updatePropertyAction,
} from "@/actions/admin/property";
import type { MasterProperties } from "@/lib/types/main.types";

export function PropertyEditForm({ property }: { property: MasterProperties }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isTogglePending, startToggleTransition] = useTransition();

  const [form, setForm] = useState({
    name: property.name,
    slug: property.slug,
    address: property.address ?? "",
    contact_wa: property.contact_wa ?? "",
    description: property.description ?? "",
  });
  const [isActive, setIsActive] = useState(property.is_active);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function handleChange(
    field: keyof typeof form
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

    startTransition(async () => {
      const res = await updatePropertyAction(property.id, property.slug, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        address: form.address.trim() || null,
        contact_wa: form.contact_wa.trim() || null,
        description: form.description.trim() || null,
      });

      if (res.error || !res.data) {
        setErrorMsg(res.error ?? "Gagal memperbarui properti");
        return;
      }

      setSuccessMsg("Perubahan tersimpan");
      router.refresh();

      // Kalau slug berubah, URL halaman ini ikut berubah
      if (res.data.slug !== property.slug) {
        router.replace(`/admin/manage/${res.data.slug}`);
      }
    });
  }

  function handleToggleActive() {
    const nextValue = !isActive;
    const confirmText = nextValue
      ? "Aktifkan kembali properti ini?"
      : "Nonaktifkan properti ini? Properti tidak akan tampil di pencarian publik.";

    if (!confirm(confirmText)) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    startToggleTransition(async () => {
      const res = await togglePropertyActiveAction(
        property.id,
        property.slug,
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
        <CardTitle>Data Properti</CardTitle>
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
            <Label htmlFor="name">Nama Properti</Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleChange("name")}
              className="w-full px-3 py-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={handleChange("slug")}
              className="w-full px-3 py-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact_wa">Kontak WhatsApp</Label>
            <Input
              id="contact_wa"
              value={form.contact_wa}
              onChange={handleChange("contact_wa")}
              className="w-full px-3 py-2"
              placeholder="62812xxxxxxx"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={form.address}
              onChange={handleChange("address")}
              className="w-full px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={handleChange("description")}
            rows={4}
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