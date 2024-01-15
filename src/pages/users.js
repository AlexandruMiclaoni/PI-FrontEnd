import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import styles from "./users.css";

const UsersForm = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]); // Add events state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3000/users/get-all");
        const eventsResponse = await axios.get("http://localhost:3000/events/get-all");

        setUsers(usersResponse.data);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching users or events: ", error);
      }
    };

    fetchUsers();
  }, []);

  const renderUsers = () => {
    return users.map((user) => (
      <tr key={user._id}>
        <td>{user.firstName || "N/A"}</td>
        <td>{user.lastName || "N/A"}</td>
        <td>{user.email}</td>
        <td>{getAttendingEventsCount(user)}</td>
        <td>{getCreatedEventsCount(user)}</td>
        <td>{isOrganizer(user) ? "Yes" : "No"}</td>
        <td>{isAdmin(user.email) ? "Yes" : "No"}</td>
      </tr>
    ));
  };

  const getAttendingEventsCount = (user) => {
    const attendingCount = events.reduce((count, event) => {
      if (event.participants.includes(user.email)) {
        return count + 1;
      }
      return count;
    }, 0);

    return attendingCount;
  };

  const getCreatedEventsCount = (user) => {
    const createdCount = events.filter(
      (event) =>
        event.organizer === user.email ||
        event.organizer === `${user.firstName} ${user.lastName}` ||
        event.organizer === user.email
    ).length;
  
    return createdCount;
  };

  const isOrganizer = (user) => {
    return user.admin && !user.email.includes("@gloevents.com");
  };

  const isAdmin = (email) => {
    return email.includes("@gloevents.com");
  };

  return (
    <div>
      <Navigation />

      <h2 style={{ color: "white" }}>Total Users: {users.length}</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Attending Events</th>
            <th>Created Events</th>
            <th>Organizer</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>{renderUsers()}</tbody>
      </table>
    </div>
  );
};

export default UsersForm;
