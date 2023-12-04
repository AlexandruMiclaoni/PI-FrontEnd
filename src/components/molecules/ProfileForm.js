"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./p-form.css";
import Navbar from "./Navbar";

const ProfileForm = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/register");
      } else {
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

  const [storedEmail, setStoredEmail] = useState("");
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
  });
  const [userEvents, setUserEvents] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (typeof window !== "undefined") {
          const emailFromLocalStorage = localStorage.getItem("email");
          setStoredEmail(emailFromLocalStorage || "");

          if (emailFromLocalStorage) {
            const response = await axios.get(
              "http://localhost:3000/users/get-all"
            );
            const users = response.data;

            const responseEvents = await axios.get(
              "http://localhost:3000/events/get-all"
            );
            const events = responseEvents.data;

            const userByEmail = users.find(
              (user) => user.email === emailFromLocalStorage
            );

            if (userByEmail) {
              const { _id, firstName, lastName } = userByEmail;

              setUserInfo({
                id: _id,
                firstName: firstName,
                lastName: lastName,
              });

              const fullName = `${firstName} ${lastName}`;

              // Filter events based on user's ObjectID
              const filteredEvents = events.filter(
                (event) => event.organizer === fullName
              );
              setUserEvents(filteredEvents);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="profile-section">
          <h1 className="profile-title">User Profile</h1>
          <p className="profile-info">Email: {storedEmail}</p>
          <p className="profile-info">ID: {userInfo.id}</p>
          <p className="profile-info">First Name: {userInfo.firstName}</p>
          <p className="profile-info">Last Name: {userInfo.lastName}</p>
        </div>

        <div className="events-section">
          <h2 className="events-title">User Events</h2>
          <div className="event-cards">
            {userEvents.map((event) => (
              <div key={event._id} className="event-card">
                <h3 className="event-name">{event.name}</h3>
                <p className="event-organizer">Organizer: {event.organizer}</p>
                <p className="event-description">
                  Description: {event.description}
                </p>
                {/* Add other event details here */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
