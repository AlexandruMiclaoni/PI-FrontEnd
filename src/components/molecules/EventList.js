import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './event-list.css';

const EventCard = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="event-card-container">
      <div className="event-card">
        <div className="event-header">
          <h2>
            <span className="event-name">{event.name}</span><span className="event-location"> at {event.location}</span></h2>
          <p className="event-time">Starting at: {event.date}</p>
        </div>

        <div className="event-button">
          <button className="view-button" onClick={handleViewButtonClick}>View</button>
        </div>
      </div>

      {isModalOpen && <EventModal selectedEvent={event} onClose={handleCloseModal} />}
    </div>
  );
};

const EventModal = ({ selectedEvent, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('event-modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="event-modal-overlay" onClick={handleOverlayClick}>
      <div className="event-modal">
        <div className="modal-header">
          <h2 className="event-name">{selectedEvent.name}</h2>
        </div>
        <div className="modal-content">
          <p className="event-info">Date: {selectedEvent.date}</p>
          <p className="event-info">Location: {selectedEvent.location}</p>
          <p className="event-description">{selectedEvent.description}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
  
};

const EventList = () => {
  const router = useRouter();

  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleCardClick = (event) => {
      setSelectedEvent(event);
  };

  const handleCloseModal = () => {
      setSelectedEvent(null);
  };

  useEffect(() => {
      const fetchEvents = async () => {
          try {
              const response = await axios.get('http://localhost:3000/events/get-all')
              setEvents(response.data);
          } catch (error) {
              console.error('Error fetching events: ', error);
          }
      }
      fetchEvents();
  }, []);

  return (
      <div className="eventnmap">
        <div className="events-body">
          <ul>
            {events.map((event) => (
              <EventCard key={event.id} event={event} onCardClick={handleCardClick} />
            ))}
          </ul>
        </div>
        {selectedEvent && <EventModal selectedEvent={selectedEvent} onClose={handleCloseModal} />}
        <div className="map-body">
        </div>
      </div>
    );
};

export default EventList;