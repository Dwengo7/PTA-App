import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

const ParentTeacherDirectory = () => {
  const auth = getAuth();
  const [teacherSchool, setTeacherSchool] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the logged-in user's school
  useEffect(() => {
    const fetchUserSchool = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userQuery = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setTeacherSchool(userData.school);
      }
    };

    fetchUserSchool();
  }, []);

  // Fetch teachers from the same school
  useEffect(() => {
    if (!teacherSchool) return;

    const fetchTeachers = async () => {
      setLoading(true);
      const teachersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'teacher'),
        where('school', '==', teacherSchool)
      );

      const snapshot = await getDocs(teachersQuery);
      const teachersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTeachers(teachersList);
      setLoading(false);
    };

    fetchTeachers();
  }, [teacherSchool]);

  return (
    <div className="p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6">Teacher Directory</h1>

      {loading ? (
        <p>Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p>No teachers found for your school.</p>
      ) : (
        <ul className="space-y-4">
          {teachers.map(teacher => (
            <li key={teacher.id} className="border p-4 rounded-lg shadow-sm">
              <p><strong>Email:</strong> {teacher.email}</p>
              {/* Add more teacher info here if available, like name, subject etc. */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParentTeacherDirectory;