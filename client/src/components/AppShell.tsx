import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";
import Logo from "./Logo";

const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-indigo-500 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

function AppShell({ children }: PropsWithChildren) {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo />
            <nav className="flex items-center gap-2">
              <NavLink to="/dashboard" className={navLinkStyles}>
                Dashboard
              </NavLink>
              <NavLink to="/partnerships" className={navLinkStyles}>
                Partnerships
              </NavLink>
              <NavLink to="/settings" className={navLinkStyles}>
                Settings
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400">{user?.email || ''}</p>
            </div>
            <Avatar name={user?.name || 'User'} />
            <button
              onClick={() => signOut()}
              className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        ScratchyPad © {new Date().getFullYear()} · Built for async, collaborative teams
      </footer>
    </div>
  );
}

export default AppShell;