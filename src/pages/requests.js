// RequestsForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import styles from "./requests.css";

const RequestsForm = () => {
  const [waitingUsers, setWaitingUsers] = useState([]);

  const fetchWaitingUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/get-all');
      const usersWithWaitingStatus = response.data.filter(user => user.waiting === true && user.admin === false );
      setWaitingUsers(usersWithWaitingStatus);
    } catch (error) {
      console.error('Error fetching waiting users: ', error);
    }
  };

  useEffect(() => {
    fetchWaitingUsers();
  }, []);

  const handleAccept = async (userId) => {
    try {
      await axios.patch(`http://localhost:3000/users/setAdmin/${userId}`);
      await axios.patch(`http://localhost:3000/users/setWaiting/${userId}`);
      fetchWaitingUsers();
    } catch (error) {
      console.error('Error accepting user: ', error);
    }
  };

  const handleDecline = async (userId) => {
    try {
      // Assuming you have an endpoint for declining users
      await axios.patch(`http://localhost:3000/users/setWaitingDecline/${userId}`);
      fetchWaitingUsers();
    } catch (error) {
      console.error('Error declining user: ', error);
    }
  };

  return (
    <div>
      <Navigation />

      <h2 style={{ color: 'white' }}>Waiting Users: {waitingUsers.length}</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {waitingUsers.map(user => (
            <tr key={user._id}>
              <td>{user.firstName || "N/A"}</td>
              <td>{user.lastName || "N/A"}</td>
              <td>{user.email || "N/A"}</td>
              <td>
                <button onClick={() => handleAccept(user._id)}>Accept</button>
                <button onClick={() => handleDecline(user._id)}>Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsForm;
