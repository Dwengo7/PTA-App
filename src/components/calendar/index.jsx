import React, { useState } from 'react';

const CalendarPage = () => {
  // Set up state to track the displayed month (default to current month)
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Helper: Get month name from month index
  const getMonthName = (monthIndex) => {
    return new Date(2000, monthIndex).toLocaleString('default', { month: 'long' });
  };

  // Helper: Get number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Build an array representing the calendar grid for the current month
  const generateCalendarCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // Determine what day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const calendarCells = [];

    // Fill in empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarCells.push(null);
    }

    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarCells.push(new Date(year, month, day));
    }
    return calendarCells;
  };

  const calendarCells = generateCalendarCells();

  // Handlers to flip through months
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Check if a given date is today
  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="p-6 mt-12">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-2 py-1 bg-gray-300 rounded">
          Prev
        </button>
        <h1 className="text-2xl font-bold">
          {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
        </h1>
        <button onClick={handleNextMonth} className="px-2 py-1 bg-gray-300 rounded">
          Next
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {calendarCells.map((date, index) => (
          <div
            key={index}
            className="border p-2 h-12 text-center flex items-center justify-center"
          >
            {date ? (
              <span className={isToday(date) ? 'bg-blue-500 text-white rounded-full px-2' : ''}>
                {date.getDate()}
              </span>
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
