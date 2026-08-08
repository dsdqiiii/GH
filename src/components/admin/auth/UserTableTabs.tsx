"use client";

import { useState } from "react";
import { ShieldCheck, Users, MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/core/card";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/core/table";
import { Button } from "@/components/ui/core/button";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  roleName?: string;
  status: "active" | "invited" | "inactive";
  createdAt: string;
}

export function UserTableTabs({ users }: { users: UserItem[] }) {
  const [activeTab, setActiveTab] = useState<"admin" | "customer">("admin");

  const filteredUsers = users.filter((user) => user.role === activeTab);

  return (
    <Card variant="flat" className="flex flex-col justify-between bg-white">
      <CardHeader className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tab */}
        <div className="flex items-center gap-2 rounded-lg bg-neutral-100 p-1">
          {/* Tab Administrator */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveTab("admin")}
            className={`!px-4 !py-1.5 text-sm font-medium transition-all ${
              activeTab === "admin"
                ? "!bg-white !text-forest shadow-sm hover:!bg-white hover:!text-forest"
                : "!bg-transparent !text-neutral-600 hover:!text-neutral-900"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Administrator</span>
          </Button>

          {/* Tab Customer */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveTab("customer")}
            className={`!px-4 !py-1.5 text-sm font-medium transition-all ${
              activeTab === "customer"
                ? "!bg-white !text-forest shadow-sm hover:!bg-white hover:!text-forest"
                : "!bg-transparent !text-neutral-600 hover:!text-neutral-900"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Customer</span>
          </Button>
        </div>

        <span className="text-xs text-neutral-500">
          Menampilkan {filteredUsers.length} {activeTab}
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow className="border-b bg-neutral-50/50 text-left text-xs text-neutral-500">
                <TableHeader className="p-3 font-medium">Pengguna</TableHeader>
                <TableHeader className="p-3 font-medium">Email</TableHeader>
                <TableHeader className="p-3 font-medium">Role</TableHeader>
                <TableHeader className="p-3 font-medium">Status</TableHeader>
                <TableHeader className="p-3 font-medium">Terdaftar</TableHeader>
                <TableHeader className="p-3 text-right font-medium">
                  Aksi
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="p-6 text-center text-sm text-neutral-400"
                  >
                    Tidak ada data {activeTab} ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b text-sm transition-colors hover:bg-neutral-50/50"
                  >
                    <TableCell className="p-3 font-medium text-neutral-900">
                      {user.name}
                    </TableCell>
                    <TableCell className="p-3 text-neutral-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="p-3 capitalize text-neutral-600">
                      {user.roleName || user.role}
                    </TableCell>
                    <TableCell className="p-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : user.status === "invited"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {user.status === "active"
                          ? "Aktif"
                          : user.status === "invited"
                          ? "Diundang"
                          : "Nonaktif"}
                      </span>
                    </TableCell>
                    <TableCell className="p-3 text-neutral-500">
                      {user.createdAt}
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="!p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}