// UsersCard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./UsersCard.module.css"; // Import the CSS module

const UsersCard = () => {
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

  const normalUsers = users.filter(user => user && !user.admin && user.email && !user.email.includes('@gloevents.com'));
  const organizers = users.filter(user => user && user.admin && user.email && !user.email.includes('@gloevents.com'));
  const admins = users.filter(user => user && user.email && user.email.includes('@gloevents.com'));

  return (
    <div className="dashboard-card">
        <div>
        <div className={styles.column}>
            <h3>Total Users</h3>
            <p>{users.length}</p>

            <div className={styles.columns}>
            <div className={styles.category}>
                <h3>Normal Users</h3>
                <p>{normalUsers.length}</p>
            </div>

            <div className={styles.category}>
                <h3>Organizers</h3>
                <p>{organizers.length}</p>
            </div>

            <div className={styles.category}>
                <h3>Admins</h3>
                <p>{admins.length}</p>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default UsersCard;
