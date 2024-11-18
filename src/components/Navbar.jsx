"use client";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  const isActive = (p) => {
    return pathname === p ? "bg-green-700" : "";
  };

  return (
    <nav className="bg-green-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-white font-bold text-xl">
            Asset Tracker
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              href="/user/portfolio"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/user/portfolio"
              )} hover:bg-green-700`}
            >
              Home
            </Link>
            <Link
              href="/user/assets"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/user/assets"
              )} hover:bg-green-700`}
            >
              Assets
            </Link>
            <Link
              href="#"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:bg-green-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/user/portfolio"
            className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive(
              "/user/portfolio"
            )} hover:bg-green-700`}
          >
            Home
          </Link>
          <Link
            href="/user/assets"
            className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive(
              "/user/assets"
            )} hover:bg-green-700`}
          >
            Assets
          </Link>
          <a
            href="#"
            className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-700"
          >
            Profile
          </a>
          <button
            onClick={handleLogout}
            className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
