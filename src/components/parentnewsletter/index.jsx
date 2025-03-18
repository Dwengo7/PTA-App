import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ParentNewsletters = () => {
  const db = getFirestore();
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState([]);

  // Fetch newsletters from Firestore
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'newsletters'));
        const fetchedNewsletters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewsletters(fetchedNewsletters);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      }
    };

    fetchNewsletters();
  }, [db]);

  return (
    <div className="p-6 mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Newsletters</h1>
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Home
        </button>
      </div>

      {/* Display Uploaded Newsletters */}
      <h2 className="text-xl font-semibold mt-6">Available Newsletters</h2>
      <div className="space-y-4">
        {newsletters.length === 0 ? (
          <p className="text-gray-500">No newsletters available yet.</p>
        ) : (
          newsletters.map((newsletter) => (
            <div key={newsletter.id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{newsletter.title}</h3>
              <p className="text-sm text-gray-500">Uploaded by: {newsletter.uploadedBy}</p>
              <a
                href={newsletter.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded inline-block"
              >
                View Newsletter
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentNewsletters;
