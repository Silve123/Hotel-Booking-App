// src/components/CalendarContainer.js

import Calendar from "react-calendar"; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const CalendarContainer = ({ handleDateChange, selectedDates, isBooked }) => {
    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleDateChange}
                value={selectedDates}
                tileClassName={({ date }) => isBooked(date)}
                selectRange={true}
            />
        </div>
    );
};

export default CalendarContainer;
