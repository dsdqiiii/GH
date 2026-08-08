import Image from "next/image";
import { Images, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/card";
import type { Galleries } from "@/lib/types/main.types";

export function PropertyGalleriesCard({ galleries }: { galleries: Galleries[] }) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Galeri</CardTitle>
      </CardHeader>

      <CardContent>
        {galleries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-neutral-500">
            <Images className="h-6 w-6 text-neutral-300" />
            Belum ada foto untuk properti ini.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {galleries.map((gallery) => (
              <div
                key={gallery.id}
                className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
              >
                <Image
                  src={gallery.url}
                  alt="Galeri properti"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                {gallery.is_main && (
                  <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-neutral-700 shadow">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    Utama
                  </span>
                )}
                {!gallery.is_active && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-medium uppercase tracking-wide text-white">
                    Nonaktif
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}