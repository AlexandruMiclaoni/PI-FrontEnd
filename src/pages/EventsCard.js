// EventsCard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const EventsCard = () => {
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const fetchEventsCount = async () => {
      try {
        const response = await axios.get('http://localhost:3000/events/get-all');
        const eventsCount = response.data.length;
        setTotalEvents(eventsCount);
      } catch (error) {
        console.error('Error fetching events count: ', error);
      }
    };

    fetchEventsCount();
  }, []);

  return (
    <div className="dashboard-card">
      <h3>Total Events</h3>
      <p>{totalEvents}</p>
    </div>
  );
};

export default EventsCard;
