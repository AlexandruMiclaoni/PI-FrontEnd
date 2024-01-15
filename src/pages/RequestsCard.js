import React, { useEffect, useState } from "react";
import axios from "axios";

const TotalRequestsCard = ({ totalRequests }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/get-all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  // Count users with waiting status true
  const waitingUsersCount = users.filter(user => user.waiting === true && user.admin === false).length;

  return (
    <div className="dashboard-card">
      <h3>Total Requests</h3>
      <p>{waitingUsersCount}</p>
    </div>
  );
};

export default TotalRequestsCard;
