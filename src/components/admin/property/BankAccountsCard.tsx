import { Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";
import type { MasterBankAccounts } from "@/lib/types/main.types";

export function BankAccountsCard({
  bankAccounts,
}: {
  bankAccounts: MasterBankAccounts[];
}) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Rekening Bank</CardTitle>
        <p className="mt-1 text-xs text-neutral-400">
          Rekening ini terhubung ke organisasi, digunakan bersama oleh semua
          properti dalam organisasi yang sama.
        </p>
      </CardHeader>

      <CardContent>
        {bankAccounts.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Belum ada rekening bank terdaftar untuk organisasi ini.
          </p>
        ) : (
          <div className="space-y-3">
            {bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {bank.bank_name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {bank.account_number} &middot; {bank.account_holder}
                    </p>
                  </div>
                </div>

                <Badge
                  size="sm"
                  className={
                    bank.is_active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-neutral-200 bg-neutral-100 text-neutral-500"
                  }
                >
                  {bank.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}