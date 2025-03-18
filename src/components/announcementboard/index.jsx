import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AnnouncementBoard = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [userSchool, setUserSchool] = useState('');

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

  useEffect(() => {
    if (!userSchool) return;

    const announcementsQuery = query(collection(db, 'announcements'), where('school', '==', userSchool));
    const unsubscribe = onSnapshot(announcementsQuery, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [db, userSchool]);

  return (
    <div>
      {announcements.map((a) => <p key={a.id}>{a.title}</p>)}
    </div>
  );
};

export default AnnouncementBoard;
