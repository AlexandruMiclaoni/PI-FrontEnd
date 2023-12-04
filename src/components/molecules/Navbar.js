// Navbar.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./navbar.css";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const Navbar = ({ isAdmin: propIsAdmin }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(propIsAdmin);

  const logout = () => {
    const email = localStorage.getItem('email');
    if (email) {
      localStorage.removeItem('email');
      router.push('/login');
    }
  }

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        // redirect to RegisterPage if token doesn't exist
        router.push('/register');
      } else {
        // verify user with token
        try {
          const response = await axios.post('http://localhost:3000/register/verify-token', {
            token: token,
          });
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
          <Link href="/" style={{ color: 'black', textDecoration: 'none' }}>
            <h1 className="events-title">Events</h1>
          </Link>
        </div>
        <div className="right">
          <ul>
            {isAdmin && (
              <li className="admin-only" onClick={handleCreateClick}>
                Create
              </li>
            )}
            <li className="notification">Notification</li>
            <li>
              <a className="profile"
                onClick={() => router.push("/profile")}>Profile</a>
            </li>
            <li>
              <button className="logout-btn" onClick={logout}>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* Add your modal content here */}
            <p>This is the modal content.</p>
            <button onClick={handleCloseModal}>Close Modal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
