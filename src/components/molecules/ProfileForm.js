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
          setIsWaiting(response.data.user.waiting);
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
    waiting: "",
  });
  const [userEvents, setUserEvents] = useState([]);
  const [userEventsAttended, setUserEventsAttended] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleRequestToBeOrganizer = async () => {
    try {
      const userId = userInfo.id;

      await axios.patch(`http://localhost:3000/users/setWaiting/${userId}`);

      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        waiting: true,
      }));
      window.location.reload();
    } catch (error) {
      console.error("Error requesting to be an organizer:", error);
    }
  };

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
              const { _id, firstName, lastName, waiting } = userByEmail;

              setUserInfo({
                id: _id,
                firstName: firstName,
                lastName: lastName,
                waiting: waiting,
              });

              const fullName = `${firstName} ${lastName}`;

              const filteredEvents = events.filter(
                (event) => event.organizer === fullName
              );
              setUserEvents(filteredEvents);

              const filteredEventsAttended = events.filter((event) =>
                event.participants.includes(emailFromLocalStorage)
              );
              setUserEventsAttended(filteredEventsAttended);
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
      <div>
        <div className="container">
          <div className="profile-section">
            <h1 className="profile-title">User Profile</h1>
            <p className="profile-info">
              <span className="white-color">Email:</span> {storedEmail}
            </p>
            <p className="profile-info">
              <span className="white-color">First name:</span>{" "}
              {userInfo.firstName}
            </p>
            <p className="profile-info">
              <span className="white-color">Last name:</span>{" "}
              {userInfo.lastName}
            </p>
            {!isAdmin && !isWaiting && (
              <button
                className="button-organizer"
                onClick={handleRequestToBeOrganizer}
              >
                Request to be an Organizer
              </button>
            )}
            {!isAdmin && isWaiting && (
              <button
                disabled
                className="button-organizer-waiting"
                onClick={handleRequestToBeOrganizer}
              >
                Request to be an organizer
              </button>
            )}
            {!isAdmin && isWaiting && (
              <p className="wait">Wait for a response!</p>
            )}
          </div>

          <div className="events-section">
            <h2 className="events-title">User Events</h2>
            <div className="event-cards">
              {userEvents.map((event) => (
                <div key={event._id} className="event-card">
                  <h3 className="event-name">{event.name}</h3>
                  <p className="event-organizer">
                    Organizer: {event.organizer}
                  </p>
                  <p className="event-description">
                    Description: {event.description}
                  </p>
                  <p className="event-description">
                    Participants: {event.participants.join(" ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="events-section">
            <h2 className="events-title">Events Attending</h2>
            <div className="event-cards">
              {userEventsAttended.map((event) => (
                <div key={event._id} className="event-card">
                  <h3 className="event-name">{event.name}</h3>
                  <p className="event-organizer">
                    Organizer: {event.organizer}
                  </p>
                  <p className="event-description">
                    Description: {event.description}
                  </p>
                  <p className="event-description">
                    Participants: {event.participants.length}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
