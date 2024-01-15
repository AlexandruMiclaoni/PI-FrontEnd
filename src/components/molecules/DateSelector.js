import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateDisplay from '../atoms/DateDisplay';
import '../atoms/date-style.css';
import EventList from '../molecules/EventList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DateSelector = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transition, setTransition] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Added state for selected category

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/events/get-all');
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handlePreviousDay = () => {
    const currentDate = new Date();
    const newDate = new Date(selectedDate);

    if (newDate >= currentDate) {
      newDate.setDate(selectedDate.getDate() - 1);
      setTransition(true);
      setTimeout(() => {
        setSelectedDate(newDate);
        setTransition(false);
      }, 300);
    }
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setTransition(true);
    setTimeout(() => {
      setSelectedDate(newDate);
      setTransition(false);
    }, 300);
  };

  const getPreviewDate = (date, offset) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + offset);

    const options = {
      month: 'long',
      day: 'numeric',
    };

    const formattedDate = newDate.toLocaleString('en-US', options);

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const isSameDate =
        eventDate.getDate() === newDate.getDate() &&
        eventDate.getMonth() === newDate.getMonth() &&
        eventDate.getFullYear() === newDate.getFullYear();

      const isSameCategory = selectedCategory === 'All' || event.category === selectedCategory;

      return isSameDate && isSameCategory;
    });

    return { formattedDate, eventCount: filteredEvents.length };
  };

  const isPreviousDisabled = () => {
    const currentDate = new Date();
    return selectedDate <= currentDate;
  };

  const previewOffsets = [0, 1, 2, 4, 5];
  const categories = ['All', 'Art', 'Food', 'Family', 'Kids', 'Sport', 'Charity'];

  const handleCategoryClick = category => {
    setSelectedCategory(category);
  };

  return (
    <div className='container'>
      <div className={`date-preview ${transition ? 'transition' : ''}`}>
        <button onClick={handlePreviousDay} className='leftButton button-with-bg' disabled={isPreviousDisabled()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {previewOffsets.map((offset, index) => {
          const { formattedDate, eventCount } = getPreviewDate(selectedDate, offset);
          return (
            <div key={index} className={index === 0 ? 'active' : ''}>
              <p>{formattedDate}</p>
              <p>{eventCount}</p>
            </div>
          );
        })}
        <button onClick={handleNextDay} className='rightButton button-with-bg'>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className='categories-container'>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-bubble ${category === selectedCategory ? 'active-category' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </div>
        ))}
      </div>
      <EventList selectedDate={selectedDate} selectedCategory={selectedCategory} />
    </div>
  );
};

export default DateSelector;
