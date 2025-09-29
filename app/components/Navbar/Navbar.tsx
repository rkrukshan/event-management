import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  // Add any paths where you want to hide the Events button & profile icon
  const hideOnPaths = ["/create","/book"];
  const hide = hideOnPaths.some((p) => location.pathname === p || location.pathname.startsWith(p));

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when URL changes (prevents it staying open after navigation)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 w-6 h-6 rounded-md"></div>
        <span className="font-bold text-lg">Tech Events</span>
      </div>

      {/* Center Menu (empty for now) */}
      <ul className="flex items-center gap-30 text-gray-600 font-medium">
        <li></li>
      </ul>

      {/* Right area: Events button + Profile */}
      <div className="flex items-center justify-center relative gap-3" ref={menuRef}>
        {/* If 'hide' is true (e.g. path is /create), these will NOT render */}
        {!hide && (
          <>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
                  : "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2"
              }
            >
              Events
            </NavLink>

            <div
              className="bg-gray-800 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer select-none"
              onClick={() => setOpen(!open)}
            >
              <span className="text-sm font-bold">MT</span>
            </div>
          </>
        )}

        {/* Dropdown (only show when open AND not hidden) */}
        {!hide && open && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-300 border border-gray-200 rounded-lg shadow-lg">
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
