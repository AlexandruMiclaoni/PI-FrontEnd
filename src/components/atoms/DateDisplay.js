import React from 'react';

const DateDisplay = ({ date, isActive }) => {
    const formattedDate = date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className={`date-rectangle ${isActive ? 'active' : 'inactive'}`}>
            <p>{formattedDate}</p>
        </div>
    )
}

export default DateDisplay;