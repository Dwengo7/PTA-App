import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/authContext';

import { useNavigate } from 'react-router-dom';

const SchoolSelection = () => {
  const db = getFirestore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [newSchool, setNewSchool] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing schools from Firestore
  useEffect(() => {
    const fetchSchools = async () => {
      const querySnapshot = await getDocs(collection(db, 'schools'));
      const schoolList = querySnapshot.docs.map(doc => doc.data().name);
      setSchools(schoolList);
    };
    fetchSchools();
  }, [db]);

  // Handle school selection or creation
  const handleSelectSchool = async (e) => {
    e.preventDefault();

    if (!selectedSchool && !newSchool) {
      alert('Please select or enter a school name.');
      return;
    }

    setLoading(true);

    try {
      let schoolName = selectedSchool || newSchool;

      // If a new school is being created, add it to Firestore
      if (newSchool) {
        const existingSchool = schools.find((school) => school.toLowerCase() === newSchool.toLowerCase());

        if (!existingSchool) {
          await addDoc(collection(db, 'schools'), { name: newSchool });
        }
      }

      // Update user’s Firestore profile with the selected school
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { school: schoolName });

      // Navigate to homepage
      navigate('/home');
    } catch (error) {
      console.error('Error selecting school:', error);
      alert('Failed to update school. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 mt-12">
      <h1 className="text-2xl font-bold">Select or Create Your School</h1>
      <p className="text-gray-600">Choose an existing school or create a new one.</p>

      <form onSubmit={handleSelectSchool} className="mt-6 space-y-4">
        {/* Select Existing School */}
        <div>
          <label className="block text-sm font-bold">Select a School</label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
          >
            <option value="">Choose a school</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        <p className="text-center text-gray-500">— OR —</p>

        {/* Create New School */}
        <div>
          <label className="block text-sm font-bold">Create a New School</label>
          <input
            type="text"
            value={newSchool}
            onChange={(e) => setNewSchool(e.target.value)}
            placeholder="Enter school name"
            className="w-full mt-2 p-2 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default SchoolSelection;
