import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './event-list.css';
import MapRender from '@/components/atoms/MapRender';

const EventCard = ({ event, onCardClick }) => {
  const date = new Date(event.date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

  const handleViewButtonClick = () => {
    onCardClick(event);
  };

  return (
    <div className="event-card-container">
      <div className="event-card">
        <div className="event-header">
          <h2>
            <span className="event-name">{event.name}</span>
            <span className="event-location"> at {event.location.locName}</span>
          </h2>
          <p className="event-time">Starting at: {formattedTime}</p>
        </div>
        
        {/* Display participants and view button on the same row */}
        <div className="event-footer">
          <p className="event-participants">Participants: {event.participants.length}</p>
          <button className="view-button" onClick={handleViewButtonClick}>View</button>
        </div>
      </div>
    </div>
  );
};

const EventModal = ({ selectedEvent, onClose }) => {
  const [isAttending, setIsAttending] = useState(false);
  const [mail, setMail] = useState('');

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('event-modal-overlay')) {
      onClose();
    }
  };

  const checkToken = async () => {
    const token = localStorage.getItem('token');
    console.log(token);
    // verify user with token
    try {
      const response = await axios.post('http://localhost:3000/register/verify-token', {
        token: token,
      });
      console.log(response.data);
      setMail(response.data.user.email);
      console.log(mail);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkToken();
    // Check if there's an attendance status in localStorage for the selectedEvent
    const storedIsAttending = localStorage.getItem(`isAttending_${selectedEvent._id}`);
    if (storedIsAttending === 'true') {
      setIsAttending(true);
    }
  }, [selectedEvent._id]); // Run this effect whenever the selectedEvent changes

  const handleAttendClick = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `http://localhost:3000/events/attend/${selectedEvent._id}/${mail}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Attend event response:', response.data);

      if (response.status === 200) {
        // Assuming the server responds with a status of 200 for a successful attendance
        setIsAttending(true);
        // Store the attendance status in localStorage for the selectedEvent
        localStorage.setItem(`isAttending_${selectedEvent._id}`, 'true');

        window.location.reload();
      }

    } catch (error) {
      console.error('Error attending event:', error);
    }
  };

  return (
    <div className="event-modal-overlay" onClick={handleOverlayClick}>
      <div className="event-modal">
        <div className="modal-header">
          <h2 className="event-name">{selectedEvent.name}</h2>
        </div>
        <div className="modal-content">
          <p className="event-info">Date: {convertToRomanianTime(selectedEvent.date).toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}</p>
          <p className="event-info">Location: {selectedEvent.location.locName}</p>
          <p className="event-info">Organizer: {selectedEvent.organizer}</p>
          <br />
          <br />
          <p className="event-description">Details:<br />{selectedEvent.description}</p>
        </div>
        <div className="modal-footer">
          {isAttending ? (
            <p className="attending-message">You are attending this event</p>
          ) : (
            <button className="participate-button" onClick={handleAttendClick}>
              Attend
            </button>
          )}
          <button onClick={onClose} className="close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const convertToRomanianTime = (utcDate) => {
  const romanianTimeZoneOffset = 3; // UTC+3 during daylight saving time

  const localDate = new Date(utcDate);
  const utcMilliseconds = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
  const romanianMilliseconds = utcMilliseconds + (romanianTimeZoneOffset * 3600000);

  return new Date(romanianMilliseconds);
};

const EventList = ({ selectedDate, selectedCategory}) => {
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
        const response = await axios.get('http://localhost:3000/events/get-all');

        const filteredEvents = response.data.filter((event) => {
          const eventDate = convertToRomanianTime(event.date);
          const formattedEventDate = eventDate.toISOString().split('T')[0];
          const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

          const isSameDate = formattedEventDate === formattedSelectedDate;
          const isSameCategory = selectedCategory === 'All' || event.category === selectedCategory;

          return isSameDate && isSameCategory;
        });

        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events: ', error);
      }
    };

    fetchEvents();
  }, [selectedDate, selectedCategory]);

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
        <MapRender events={events} />
      </div>
    </div>
  );
};

export default EventList;
