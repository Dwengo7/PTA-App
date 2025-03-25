import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

const TeacherApprovalPage = () => {
  const auth = getAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teacherSchool, setTeacherSchool] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch teacher's school
  useEffect(() => {
    const fetchTeacherSchool = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const teacherQuery = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()));
      const snapshot = await getDocs(teacherQuery);
      if (!snapshot.empty) {
        const school = snapshot.docs[0].data().school;
        setTeacherSchool(school);
      }
    };

    fetchTeacherSchool();
  }, );

  // Fetch users requesting access to this school
  useEffect(() => {
    if (!teacherSchool) return;

    const fetchPendingUsers = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'users'),
        where('requestedSchool', '==', teacherSchool),
        where('school', '==', "") // Not yet approved
      );

      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPendingUsers(users);
      setLoading(false);
    };

    fetchPendingUsers();
  }, [teacherSchool]);

  // Handle approval
  const handleApproval = async (userId, approve) => {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      school: approve ? teacherSchool : "",
      isApproved: approve,
      requestedSchool: approve ? "" : null // Clear requestedSchool if rejected
    });

    // Refresh the list
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="p-6 mt-16">
      <h1 className="text-2xl font-bold mb-4">Pending User Approvals</h1>
      {loading ? (
        <p>Loading pending requests...</p>
      ) : pendingUsers.length === 0 ? (
        <p>No pending users requesting to join <strong>{teacherSchool}</strong>.</p>
      ) : (
        <ul className="space-y-4">
          {pendingUsers.map(user => (
            <li key={user.id} className="border p-4 rounded shadow-sm">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Requested School:</strong> {user.requestedSchool}</p>
              <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Requested At:</strong> {user.createdAt.toDate().toLocaleString()}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleApproval(user.id, true)}
                  className="px-4 py-1 bg-green-500 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(user.id, false)}
                  className="px-4 py-1 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherApprovalPage;
