import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged
 } from 'firebase/auth';

const db = getFirestore();

const CalendarPage = () => {
  const today = new Date();
  const auth = getAuth();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState([]);
  const [userSchool, setUserSchool] = useState('');
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Fetch user's school
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserSchool(user.email);
    } else {
      console.log("No user is signed in.");
    }
  });
  return () => unsubscribe();
}, );

const fetchUserSchool = async (email) => {
  const userQuery = query(collection(db, 'users'), where('email', '==', email));
  const userSnapshot = await getDocs(userQuery);
  console.log(email);

  if (!userSnapshot.empty) {
    const school = userSnapshot.docs[0].data().school;
    console.log(userSnapshot.docs[0].data());
    setUserSchool(school);
    console.log("User's school:", school);
  } else {
    console.log("User document not found in Firestore for email:", email);
  }
};

  // Fetch events from Firestore based on school
  useEffect(() => {
    if (!userSchool) return;

    console.log(userSchool);

    const eventsQuery = query(collection(db, 'calendarEvents'), where('school', '==', userSchool));

    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().date) // convert timestamp to JS Date
      }));
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, [userSchool]);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event =>
      event.date.toDateString() === date.toDateString()
    );
  };

  // Create grid of 42 days for display
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const totalCells = 42;

  const renderCalendarCells = () => {
    return Array.from({ length: totalCells }, (_, index) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index - startDay + 1);
      const inCurrentMonth = date.getMonth() === currentDate.getMonth();
      const isToday = date.toDateString() === today.toDateString();
      const dateEvents = getEventsForDate(date);

      return (
        <div
          key={index}
          className={`border p-1 h-20 overflow-hidden cursor-pointer flex flex-col text-sm 
            ${inCurrentMonth ? '' : 'text-gray-400'} 
            ${isToday ? 'bg-blue-100 border-blue-500' : ''}`}
          onClick={() => {
            setSelectedDateEvents(dateEvents);
            setShowEventDetails(true);
          }}
        >
          <div className="text-right pr-1">{date.getDate()}</div>
          <div className="flex-grow overflow-y-auto">
            {dateEvents.map(event => (
              <div key={event.id} className="bg-blue-500 text-white text-xs px-1 rounded mb-0.5 truncate">
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="p-6 mt-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="px-2 py-1 bg-gray-300 rounded">Prev</button>
        <h1 className="text-2xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h1>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="px-2 py-1 bg-gray-300 rounded">Next</button>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {renderCalendarCells()}
      </div>

      {/* Event Details Modal */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Events</h2>
            {selectedDateEvents.length === 0 ? (
              <p>No events on this day.</p>
            ) : (
              selectedDateEvents.map(event => (
                <div key={event.id} className="mb-3">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              ))
            )}
            <button onClick={() => setShowEventDetails(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

