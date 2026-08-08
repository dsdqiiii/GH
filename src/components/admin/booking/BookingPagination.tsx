"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function BookingPagination({
  totalPages,
  currentPage,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function createPageURL(pageNumber: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    replace(createPageURL(page));
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-md border border-neutral-200 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
      >
        Sebelumnya
      </button>

      <span className="text-neutral-500">
        Halaman <strong className="text-neutral-900">{currentPage}</strong> dari{" "}
        <strong className="text-neutral-900">{totalPages}</strong>
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-md border border-neutral-200 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
      >
        Selanjutnya
      </button>
    </div>
  );
}