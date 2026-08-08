import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import type { ActivityLogItem } from "@/lib/types/activity-log.types";
import { formatDateTime } from "@/utils/formatter.utils";

const actorBadgeClass: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700 border-purple-200",
  user: "bg-blue-50 text-blue-700 border-blue-200",
  system: "bg-neutral-100 text-neutral-600 border-neutral-200",
  anonymous: "bg-amber-50 text-amber-700 border-amber-200",
};

export function ActivityLogTable({ logs }: { logs: ActivityLogItem[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
        Belum ada riwayat aktivitas.
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-auto rounded-lg border border-neutral-200 bg-white">
      <Table className="text-sm">
        <TableHead className="sticky top-0 z-10 bg-white">
          <TableRow className="border-b border-neutral-200 text-left text-neutral-500">
            <TableHeader className="w-[180px] min-w-[150px] bg-white px-4 py-3 font-medium">
              Aktor
            </TableHeader>
            <TableHeader className="w-[160px] min-w-[130px] bg-white px-4 py-3 font-medium">
              Event
            </TableHeader>
            <TableHeader className="w-[160px] min-w-[140px] bg-white px-4 py-3 font-medium">
              Entitas
            </TableHeader>
            <TableHeader className="min-w-[200px] bg-white px-4 py-3 font-medium">
              Metadata / Detail
            </TableHeader>
            <TableHeader className="w-[160px] min-w-[140px] bg-white px-4 py-3 font-medium">
              Waktu
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className="border-b border-neutral-100 last:border-0"
            >
              {/* Column Aktor */}
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      actorBadgeClass[log.actorType] ?? "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {log.actorType}
                  </span>
                </div>
                {log.actorName ? (
                  <div>
                    <div className="font-medium text-neutral-900">{log.actorName}</div>
                    {log.actorEmail && (
                      <div className="text-xs text-neutral-400">{log.actorEmail}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-neutral-400 font-mono">
                    {log.actorId ? `${log.actorId.slice(0, 8)}...` : "-"}
                  </div>
                )}
              </TableCell>

              {/* Column Event */}
              <TableCell className="px-4 py-3">
                <span className="inline-flex rounded bg-neutral-100 px-2 py-1 font-mono text-xs font-semibold text-neutral-800">
                  {log.event}
                </span>
              </TableCell>

              {/* Column Entitas */}
              <TableCell className="px-4 py-3 text-neutral-700">
                <div className="font-medium text-neutral-900">{log.entityType}</div>
                <div className="font-mono text-xs text-neutral-400">
                  {log.entityId ? `ID: ${log.entityId.slice(0, 8)}...` : "-"}
                </div>
              </TableCell>

              {/* Column Metadata */}
              <TableCell className="px-4 py-3 text-neutral-600">
                {log.metadata && Object.keys(log.metadata).length > 0 ? (
                  <pre className="max-w-xs truncate font-mono text-xs text-neutral-500">
                    {JSON.stringify(log.metadata)}
                  </pre>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </TableCell>

              {/* Column Waktu */}
              <TableCell className="px-4 py-3 text-neutral-500">
                {formatDateTime(log.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}