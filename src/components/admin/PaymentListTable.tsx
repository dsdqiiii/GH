"use client";

import React, { useState } from "react";
import { ExternalLink, ImageIcon } from "lucide-react";
import { PaymentSummaryWithSignedUrl } from "@/lib/types/payment.types";
import { formatDateTime, formatCurrency } from "@/utils/formatter.utils";
import { statusLabel, statusClass } from "@/lib/constants/status";
import { Button } from "@/components/ui/core/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";

interface PaymentListTableProps {
  payments: PaymentSummaryWithSignedUrl[];
}

export function PaymentListTable({ payments }: PaymentListTableProps) {
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
        Belum ada pembayaran.
      </div>
    );
  }

  return (
    <>
      <div className="max-h-[600px] overflow-auto rounded-lg border border-neutral-200 bg-white">
        <Table className="text-sm">
          <TableHead className="sticky top-0 z-10 bg-white">
            <TableRow className="border-b border-neutral-200 text-left text-neutral-500">
              <TableHeader className="w-[140px] min-w-[120px] bg-white px-4 py-3 font-medium">
                Kode Order
              </TableHeader>
              <TableHeader className="w-[130px] min-w-[100px] bg-white px-4 py-3 font-medium">
                Nominal
              </TableHeader>
              <TableHeader className="w-[180px] min-w-[150px] bg-white px-4 py-3 font-medium">
                Bank Tujuan
              </TableHeader>
              <TableHeader className="w-[140px] min-w-[120px] bg-white px-4 py-3 font-medium">
                Tanggal
              </TableHeader>
              <TableHeader className="bg-white px-4 py-3 font-medium">
                Bukti Transfer
              </TableHeader>
              <TableHeader className="bg-white px-4 py-3 font-medium">
                Status
              </TableHeader>
              <TableHeader className="bg-white px-4 py-3 font-medium">
                Aksi
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                className="border-b border-neutral-100 last:border-0"
              >
                {/* Kode Order / Booking Code */}
                <TableCell className="px-4 py-3 font-medium text-neutral-900">
                  {payment.booking_code || payment.order_id || "-"}
                </TableCell>

                {/* Nominal */}
                <TableCell className="px-4 py-3 font-semibold text-neutral-900">
                  {formatCurrency(payment.amount)}
                </TableCell>

                {/* Bank Tujuan */}
                <TableCell className="px-4 py-3 text-neutral-700">
                  <div>{payment.destination_bank_name || "-"}</div>
                  {payment.destination_account_number && (
                    <div className="text-xs text-neutral-400">
                      {payment.destination_account_number} a.n{" "}
                      {payment.destination_account_holder}
                    </div>
                  )}
                </TableCell>

                {/* Tanggal */}
                <TableCell className="px-4 py-3 text-neutral-500">
                  {formatDateTime(payment.created_at)}
                </TableCell>

                {/* Bukti Transfer */}
                <TableCell className="px-4 py-3">
                  {payment.signedUrl ? (
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedProofUrl(payment.signedUrl)}
                      className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 !rounded-lg"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Lihat Bukti
                    </Button>
                  ) : (
                    <span className="text-xs text-neutral-400">
                      Tidak ada bukti
                    </span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusClass[payment.status] ??
                      "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {statusLabel[payment.status] ?? payment.status}
                  </span>
                </TableCell>

                {/* Aksi */}
                <TableCell className="px-4 py-3">
                  <Button
                    href={`/admin/pembayaran/${payment.id}`}
                    variant="ghost"
                    className="border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 !rounded-md"
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Preview Bukti Transfer */}
      {selectedProofUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProofUrl(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-neutral-800">
                Bukti Pembayaran
              </h3>
              <a
                href={selectedProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                Buka Tab Baru <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="relative flex max-h-[75vh] min-h-[250px] items-center justify-center overflow-auto rounded-lg bg-neutral-100">
              <img
                src={selectedProofUrl}
                alt="Bukti Transfer"
                className="max-h-[70vh] w-auto rounded object-contain"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setSelectedProofUrl(null)}
                className="px-4 py-2 text-xs !rounded-lg cursor-pointer"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}