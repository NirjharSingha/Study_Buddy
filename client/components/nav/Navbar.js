// app/Components/Navbar.js
"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobals } from "@/contexts/Globals";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { MdLogout } from "react-icons/md";

export default function Navbar() {
  const pathname = usePathname();
  const { toastRef, toastMessage, setToastMessage } = useGlobals();
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    const verifyJwt = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verifyJwtToken`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            return;
          }
        } catch (error) {
          console.log("Error:", error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            if (pathname !== "/auth") {
              setToastMessage("Please sign in to continue");
            }
            router.push("/auth");
          }
        }
      } else {
        if (pathname !== "/auth") {
          setToastMessage("Please sign in to continue");
        }
        router.push("/auth");
      }
    };

    verifyJwt(); // Call the function here
    const role = localStorage.getItem("role");
    setUser(role);
  }, []); // Include dependencies

  useEffect(() => {
    if (toastMessage !== "") {
      toastRef && toastRef.current && toastRef.current.click();
    }
    if (toastMessage === "Session expired. Please login again") {
      router.push("/auth");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [toastMessage]);

  return (
    <nav
      className={styles.navbar}
      style={
        pathname === "/auth" || pathname === "/admin" ? { display: "none" } : {}
      }
    >
      <div style={{ display: "none" }}>
        <Toast />
      </div>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="ToToCompany Logo"
            width={60}
            height={60}
          />
          StudyBuddy
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href={user === "ADMIN" ? "/account/profile" : "/account"}>
            Account
          </Link>
        </li>
        <div>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item w-[.8rem] h-[.8rem] p-0">
                {""}
              </span>
            </div>
          </button>
        </div>
        <div
          className={styles.signIn}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
          }}
        >
          <Link href="/auth" className="hover:text-black">
            Sign out
          </Link>
          <MdLogout className="text-[20px] font-bold rotate-180 cursor-pointer " />
        </div>
      </ul>
    </nav>
  );
}
