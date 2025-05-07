import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

const TeacherClasses = () => {
  const auth = getAuth();
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [selectedStudentUID, setSelectedStudentUID] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [teacherSchool, setTeacherSchool] = useState({});
  const [studentsMap, setStudentsMap] = useState({});

  useEffect(() => {
    const fetchTeacherData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userQuery = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setTeacherSchool(userData.school);

        const classesQuery = query(collection(db, 'classes'), where('teacherId', '==', user.uid));
        const classesSnapshot = await getDocs(classesQuery);
        const classList = classesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClasses(classList);

        const studentsQuery = query(
          collection(db, 'students'),
          where('school', '==', userData.school)
        );
        const studentsSnapshot = await getDocs(studentsQuery);
        const studentsArray = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          initials: doc.data().initials,
          studentId: doc.data().studentId,
        }));
        setStudentsList(studentsArray);

        const map = {};
        studentsArray.forEach(student => {
          map[student.id] = student;
        });
        setStudentsMap(map);
      }
    };

    fetchTeacherData();
  }, []);

  // Create Class
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className) return alert('Please enter a class name.');

    try {
      const docRef = await addDoc(collection(db, 'classes'), {
        className,
        teacherId: auth.currentUser.uid,
        school: teacherSchool,
        students: []
      });

      setClasses(prev => [...prev, {
        id: docRef.id,
        className,
        teacherId: auth.currentUser.uid,
        school: teacherSchool,
        students: []
      }]);

      setClassName('');
      alert('Class created successfully!');
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class.');
    }
  };

  // Add Student to Class
  const handleAddStudentToClass = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedStudentUID) return alert('Select a class and a student.');

    try {
      const classRef = doc(db, 'classes', selectedClassId);
      const selectedClass = classes.find(c => c.id === selectedClassId);

      const updatedStudents = [...(selectedClass?.students || []), selectedStudentUID];

      await updateDoc(classRef, { students: updatedStudents });

      setClasses(prev =>
        prev.map(c =>
          c.id === selectedClassId ? { ...c, students: updatedStudents } : c
        )
      );

      setSelectedStudentUID('');
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student.');
    }
  };

  // ✅ Remove Student from Class
  const handleRemoveStudent = async (classId, studentUID) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;

    try {
      const classRef = doc(db, 'classes', classId);
      const selectedClass = classes.find(c => c.id === classId);

      const updatedStudents = (selectedClass.students || []).filter(uid => uid !== studentUID);

      await updateDoc(classRef, { students: updatedStudents });

      setClasses(prev =>
        prev.map(c =>
          c.id === classId ? { ...c, students: updatedStudents } : c
        )
      );

    } catch (error) {
      console.error('Error removing student:', error);
      alert('Failed to remove student.');
    }
  };

  return (
    <div className="p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6">Manage Your Classes</h1>

      {/* Create Class */}
      <form onSubmit={handleCreateClass} className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Create New Class</h2>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class Name"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Class
        </button>
      </form>

      {/* Add Student */}
      <form onSubmit={handleAddStudentToClass} className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Add Student to a Class</h2>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.className}
            </option>
          ))}
        </select>

        <select
          value={selectedStudentUID}
          onChange={(e) => setSelectedStudentUID(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Student</option>
          {studentsList.map((student) => (
            <option key={student.id} value={student.id}>
              {student.initials} ({student.studentId})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Student
        </button>
      </form>

      {/* List Classes */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
        {classes.length === 0 ? (
          <p>No classes created yet.</p>
        ) : (
          classes.map(c => (
            <div key={c.id} className="border p-4 rounded shadow-sm">
              <h3 className="text-lg font-bold">{c.className}</h3>
              <p className="text-sm text-gray-500 mb-2">Students:</p>
              {c.students.length === 0 ? (
                <p className="text-gray-400 italic">No students added yet.</p>
              ) : (
                <ul className="list-disc ml-6 space-y-2">
                  {c.students.map((studentUID, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <span>
                        {studentsMap[studentUID]?.initials || 'Unknown'} ({studentsMap[studentUID]?.studentId || 'N/A'})
                      </span>
                      <button
                        onClick={() => handleRemoveStudent(c.id, studentUID)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherClasses;

