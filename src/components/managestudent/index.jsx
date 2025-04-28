import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

const ManageStudents = () => {
  const auth = getAuth();
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedParentUID, setSelectedParentUID] = useState('');
  const [parentsList, setParentsList] = useState([]);
  const [parentEmailsMap, setParentEmailsMap] = useState({});
  const [school, setSchool] = useState('');

  useEffect(() => {
    const fetchSchool = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setSchool(userData.school);
      }
    };

    fetchSchool();
  }, []);

  useEffect(() => {
    const fetchParents = async () => {
      if (!school) return;

      const parentsQuery = query(
        collection(db, 'users'),
        where('school', '==', school),
        where('role', '==', 'parent')
      );

      const parentsSnapshot = await getDocs(parentsQuery);
      const parentList = parentsSnapshot.docs.map(doc => ({
        uid: doc.id,
        email: doc.data().email,
      }));
      setParentsList(parentList);

      // Build a UID -> email map for easier lookup
      const emailMap = {};
      parentList.forEach(parent => {
        emailMap[parent.uid] = parent.email;
      });
      setParentEmailsMap(emailMap);
    };

    fetchParents();
  }, [school]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!school) return;

      const studentsQuery = query(collection(db, 'students'), where('school', '==', school));
      const snapshot = await getDocs(studentsQuery);
      const studentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentList);
    };

    fetchStudents();
  }, [school]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentName || !studentId || !selectedParentUID) {
      alert('Please complete all fields.');
      return;
    }

    // ✨ Generate initials
    const initials = studentName
      .split(' ')
      .map((n) => n[0].toUpperCase())
      .join('');

    try {
      await addDoc(collection(db, 'students'), {
        initials,         // ✅ Only store initials
        studentId,
        parentUID: selectedParentUID,
        school,
      });

      setStudentName('');
      setStudentId('');
      setSelectedParentUID('');
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student.');
    }
  };

  return (
    <div className="p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6">Manage Students</h1>

      {/* Add Student */}
      <form onSubmit={handleAddStudent} className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Add New Student</h2>

        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Student Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Student ID"
          className="w-full p-2 border rounded"
        />

        <select
          value={selectedParentUID}
          onChange={(e) => setSelectedParentUID(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Parent</option>
          {parentsList.map((parent) => (
            <option key={parent.uid} value={parent.uid}>
              {parent.email}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Student
        </button>
      </form>

      {/* List Students */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Existing Students</h2>
        {students.length === 0 ? (
          <p>No students yet.</p>
        ) : (
          students.map((student) => (
            <div key={student.id} className="border p-3 rounded shadow-sm">
              <p><strong>Initials:</strong> {student.initials}</p>
              <p><strong>Student ID:</strong> {student.studentId}</p>
              <p><strong>Parent Email:</strong> {parentEmailsMap[student.parentUID] || 'Unknown Parent'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageStudents;

