import React, { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AnnouncementBoard = () => {
  const db = getFirestore();
  const auth = getAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [userSchool, setUserSchool] = useState('');

  useEffect(() => {
    const fetchUserSchool = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userQuery = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        setUserSchool(userSnapshot.docs[0].data().school);
      }
    };

    fetchUserSchool();
  }, []);

  useEffect(() => {
    if (!userSchool) return;

    const announcementsQuery = query(
      collection(db, 'announcements'),
      where('school', '==', userSchool)
    );

    const unsubscribe = onSnapshot(announcementsQuery, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [userSchool]);

  return (
    <div className="p-6 mt-16 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-10">School Announcements</h1>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No announcements available at the moment.</p>
      ) : (
        <div className="space-y-8">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border p-6 rounded-lg shadow-lg bg-white">
              <h2 className="text-3xl font-bold mb-2">{announcement.title}</h2>
              <p className="text-lg text-gray-600">{new Date(announcement.date).toLocaleDateString()}</p>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">{announcement.content}</p>
              <p className="mt-4 text-sm text-gray-400">Posted by: {announcement.createdBy || "School Administration"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementBoard;
