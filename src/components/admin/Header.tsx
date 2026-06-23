export default function Header() {
  return (
    <header className="h-32 bg-blue-600 border-b text-white border-gray-200 flex items-center justify-between px-6">
      <div className="text-sm">
        Welcome back, Admin
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm hover:text-gray-900">
          Notifications
        </button>

        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
}