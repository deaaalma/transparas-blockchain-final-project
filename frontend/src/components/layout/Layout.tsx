import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex h-full w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      {/* ── Narrow Sidebar (icon-only) ─────────────────────────────── */}
      <Sidebar />

      {/* ── Main area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <Topbar />

        {/* Scrollable content area where nested routes render */}
        <main className="flex-1 overflow-y-auto px-7 py-6" style={{ background: 'var(--color-bg-base)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
