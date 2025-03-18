import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, onSnapshot, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TeacherCalendar = () => {
  const today = new Date();
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState([]);
  const [userSchool, setUserSchool] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Fetch the teacher's school from Firestore
  useEffect(() => {
    const fetchUserSchool = async () => {
      if (!auth.currentUser) return;

      const userQuery = query(collection(db, 'users'), where('email', '==', auth.currentUser.email));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        setUserSchool(userSnapshot.docs[0].data().school);
      }
    };

    fetchUserSchool();
  }, [auth.currentUser]);

  // Fetch events for the teacher's school
  useEffect(() => {
    if (!userSchool) return;

    const eventsQuery = query(collection(db, 'calendarEvents'), where("school", "==", userSchool));

    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, [db, userSchool]);

  // Function to delete an event
  const handleDeleteEvent = async (id, createdBy) => {
    if (auth.currentUser?.email !== createdBy) {
      alert('You can only delete your own events!');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'calendarEvents', id));
      setShowEventDetails(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="p-6 mt-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="px-2 py-1 bg-gray-300 rounded">Prev</button>
        <h1 className="text-2xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h1>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="px-2 py-1 bg-gray-300 rounded">Next</button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="p-2">{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {Array.from({ length: 42 }, (_, index) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index - currentDate.getDay() + 1);
          return (
            <div key={index} className="border p-2 h-16 flex flex-col items-center justify-center">
              <span className={date.toDateString() === today.toDateString() ? 'bg-blue-500 text-white rounded-full px-2' : ''}>{date.getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherCalendar;
