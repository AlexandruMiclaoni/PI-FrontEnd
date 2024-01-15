// components/Navigation.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./navigation.css"; // Import your styles

const Navigation = () => {
  const router = useRouter();

  const logout = () => {
    const email = localStorage.getItem("email");
    if (email) {
      localStorage.removeItem("email");
      localStorage.removeItem("token");
    }
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/dashboard">
            <div className={router.pathname === "/dashboard" ? styles.active : ""}>
              Home
            </div>
          </Link>
        </li>
        <li>
          <Link href="/requests">
            <div className={router.pathname === "/requests" ? styles.active : ""}>
              Requests
            </div>
          </Link>
        </li>
        <li>
          <Link href="/events">
            <div className={router.pathname === "/events" ? styles.active : ""}>
              Events
            </div>
          </Link>
        </li>
        <li>
          <Link href="/users">
            <div className={router.pathname === "/users" ? styles.active : ""}>
              Users
            </div>
          </Link>
        </li>
        <li>
          <Link href="./login">
            <div onClick={logout}>Logout</div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
