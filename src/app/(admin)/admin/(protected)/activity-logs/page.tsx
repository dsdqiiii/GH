import { ActivityLogTable } from "@/components/admin/ActivityLogTable";
import { ActivityLogSearch } from "@/components/admin/ActivityLogSearch";
import { getActivityLogs } from "@/services/admin/activity-log";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminActivityLogPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.search ?? "";

  const logs = await getActivityLogs({
    search: query,
    limit: 100,
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            Activity Log
          </h1>
          <p className="text-sm text-neutral-500">
            Menampilkan {logs.length} aktivitas terbaru.
          </p>
        </div>

        {/* Komponen Search */}
        <ActivityLogSearch />
      </div>

      <div className="space-y-3">
        {/* Komponen Tabel */}
        <ActivityLogTable logs={logs} />
      </div>
    </div>
  );
}