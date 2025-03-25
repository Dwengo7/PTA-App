import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TeacherAnnouncementBoard = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('announcement'); // Default: Announcement
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [userSchool, setUserSchool] = useState('');

  // Fetch teacher's school from Firestore
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

  // Fetch announcements & events only for the teacher's school
  useEffect(() => {
    if (!userSchool) return;

    const announcementsQuery = query(collection(db, 'announcements'), where('school', '==', userSchool));
    const eventsQuery = query(collection(db, 'calendarEvents'), where('school', '==', userSchool));

    const unsubscribeAnnouncements = onSnapshot(announcementsQuery, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeAnnouncements();
      unsubscribeEvents();
    };
  }, [db, userSchool]);

  // Function to add an announcement or event
  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!title || !date || !content) {
      alert('Please fill in all fields before posting.');
      return;
    }

    try {
      const collectionName = mode === 'announcement' ? 'announcements' : 'calendarEvents';
      await addDoc(collection(db, collectionName), {
        title,
        date,
        content,
        school: userSchool,
        createdBy: auth.currentUser?.email || 'Unknown Teacher',
        createdAt: new Date(),
      });

      // Clear form fields after submission
      setTitle('');
      setDate('');
      setContent('');
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  // Function to delete an announcement or event
  const handleDeleteItem = async (id, createdBy, collectionName) => {
    if (auth.currentUser?.email !== createdBy) {
      alert('You can only delete your own posts!');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this?')) return;

    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="p-6 mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Teacher Announcements & Events</h1>
      </div>

      {/* Toggle between Announcement & Event */}
      <div className="mb-4">
        <label className="font-bold mr-4">Create:</label>
        <button onClick={() => setMode('announcement')} className={`px-4 py-2 mr-2 ${mode === 'announcement' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>Announcement</button>
        <button onClick={() => setMode('event')} className={`px-4 py-2 ${mode === 'event' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>Event</button>
      </div>

      {/* Post a New Announcement or Event */}
      <form onSubmit={handleAddItem} className="mb-6 p-4 border rounded-lg shadow-md bg-gray-100">
        <h2 className="text-xl font-semibold mb-2">Post a New {mode === 'announcement' ? 'Announcement' : 'Event'}</h2>

        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Enter title" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded" rows="3" placeholder="Enter details"></textarea>

        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Post {mode === 'announcement' ? 'Announcement' : 'Event'}</button>
      </form>

      {/* Display Announcements */}
      <h2 className="text-xl font-semibold mt-6">Announcements</h2>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{announcement.title}</h2>
              <p className="text-gray-500 text-sm">{announcement.date}</p>
              <p className="mt-2">{announcement.content}</p>
              <p className="text-sm text-gray-400">Posted by: {announcement.createdBy}</p>
              {auth.currentUser?.email === announcement.createdBy && (
                <button onClick={() => handleDeleteItem(announcement.id, announcement.createdBy, 'announcements')} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherAnnouncementBoard;
