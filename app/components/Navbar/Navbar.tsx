import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const hideOnPaths = ["/book", "/userlogin", "/admin/login", "/usercreate"];
  const hide = hideOnPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md px-2 py-3 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      {/* Left Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 w-6 h-6 rounded-md"></div>
        <span className="font-bold text-lg text-black">Tech Events</span>
      </div>

      <ul className="flex items-center gap-30 text-gray-600 font-medium">
        <li></li>
      </ul>

      <div
        className="flex items-center justify-center relative gap-3"
        ref={menuRef}
      >
        {/* Create Event Button with Tooltip */}
        {!hide && (
          <div className="relative group">
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
                  : "flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2"
              }
            >
              <IoCreateOutline size={20} />
            </NavLink>

            {/* Tooltip */}
            <span className="absolute bottom-[-2] left-1/2 transform -translate-x-1/2
                             bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                             group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Create Event
            </span>
          </div>
        )}

        {/* Profile Circle */}
        <div
          className="bg-gray-800 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          <span className="text-sm font-bold">MT</span>
        </div>

        {/* Dropdown Menu */}
        {!hide && open && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
