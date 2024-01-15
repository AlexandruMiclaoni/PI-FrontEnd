// Navbar.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./navbar.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./CreateEventModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";


import CreateEvent from "@/components/molecules/CreateEvent";

const Navbar = ({ isAdmin: propIsAdmin }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(propIsAdmin);

  const logout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("token");
  
    // Redirect to the login page
    router.push("/login");
  };

  const handleCreateClick = () => {
    if (isAdmin) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // redirect to RegisterPage if token doesn't exist
        router.push("/register");
      } else {
        // verify user with token
        try {
          const response = await axios.post(
            "http://localhost:3000/register/verify-token",
            {
              token: token,
            }
          );
          setIsAdmin(response.data.user.admin);
        } catch (error) {
          console.error(error);
        }
      }
    };

    checkToken();
  }, []);

  return (
    <div>
      <div className="navbar">
        <div className="left">
          <Link href="/" style={{ color: "black", textDecoration: "none" }}>
            <h1 className="title-event">Events</h1>
          </Link>
        </div>
        <div className="right">
          <ul>
            {/* Show the "Create" button for admins */}
            {isAdmin && (
              <li className="admin-only" onClick={handleCreateClick}>
                Create
              </li>
            )}
            <li>
              <a className="profile" onClick={() => router.push("/profile")}>
                Profile
              </a>
            </li>
            <li>
              <button className="logout-btn " onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <CreateEvent onClose={handleCloseModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
