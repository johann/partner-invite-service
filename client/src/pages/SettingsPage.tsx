import { useAuth } from "../hooks/useAuth";

function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">
          Configure your profile and preferences. Settings sync across your devices.
        </p>
      </div>

      {/* Profile Information */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Name
            </label>
            <div className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white">
              {user?.name || 'Not set'}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <div className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white">
              {user?.email || 'Not set'}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              User ID
            </label>
            <div className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-mono text-slate-400">
              {user?.id || 'Not available'}
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-12 text-center">
        <div className="mb-4 text-4xl">🚧</div>
        <h3 className="mb-2 text-lg font-semibold text-white">More Settings Coming Soon</h3>
        <p className="text-sm text-slate-400">
          Profile editing, notification preferences, and more will be available in a future update.
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;