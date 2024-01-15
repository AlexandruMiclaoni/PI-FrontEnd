// EventsForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import styles from "./events.css";

const EventsForm = () => {
    const [events, setEvents] = useState([]);
  
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/events/get-all");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
  
    useEffect(() => {
      fetchEvents();
    }, []);
  
    const handleDeleteEvent = async (eventId) => {
      try {
        await axios.delete(`http://localhost:3000/events/delete-event/${eventId}`);
        fetchEvents(); // Now fetchEvents is accessible
      } catch (error) {
        console.error("Error deleting event: ", error);
      }
    };
  

  return (
    <div>
      <Navigation />

      <h2 style={{ color: "white" }}>Total Events: {events.length}</h2>
      
      <div className="event-cards-container">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>Event Details:</h3>
            <p>ID: {event._id}</p>
            <p>Name: {event.name}</p>
            <p>Organizer: {event.organizer}</p>
            <p>Location: {event.location.locName}</p>
            <p>Date/Time: {new Date(event.date).toLocaleString()}</p>
            <p>Participants: {event.participants.length}</p>
            <button className="delete-button" onClick={() => handleDeleteEvent(event._id)}>
                Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsForm;
