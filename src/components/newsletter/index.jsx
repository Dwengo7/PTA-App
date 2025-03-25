import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const UploadNewsletter = () => {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [newsletters, setNewsletters] = useState([]);

  // Fetch uploaded newsletters from Firestore
  useEffect(() => {
    const fetchNewsletters = async () => {
      const querySnapshot = await getDocs(collection(db, 'newsletters'));
      const fetchedNewsletters = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsletters(fetchedNewsletters);
    };

    fetchNewsletters();
  }, [db]);

  // Handle adding a new newsletter link
  const handleAddNewsletter = async (e) => {
    e.preventDefault();

    if (!title || !fileLink) {
      alert('Please enter a title and a valid file link.');
      return;
    }

    try {
      await addDoc(collection(db, 'newsletters'), {
        title,
        fileUrl: fileLink,
        uploadedBy: auth.currentUser?.email || 'Unknown Teacher',
        uploadedAt: new Date(),
      });

      setTitle('');
      setFileLink('');
      alert('Newsletter added successfully!');
    } catch (error) {
      console.error('Error adding newsletter:', error);
      alert('Failed to add newsletter.');
    }
  };

  return (
    <div className="p-6 mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Share a Newsletter</h1>
      </div>

      {/* Newsletter Link Submission Form */}
      <div className="border p-4 rounded-lg shadow-md bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">Add a Newsletter</h2>
        <form onSubmit={handleAddNewsletter}>
          <label className="block font-bold">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            placeholder="Enter newsletter title"
          />

          <label className="block font-bold">File Link (Google Drive, OneDrive, etc.):</label>
          <input
            type="url"
            value={fileLink}
            onChange={(e) => setFileLink(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            placeholder="Paste shareable link here"
          />

          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Share Newsletter
          </button>
        </form>
      </div>

      {/* Display Uploaded Newsletters */}
      <h2 className="text-xl font-semibold mt-6">Shared Newsletters</h2>
      <div className="space-y-4">
        {newsletters.length === 0 ? (
          <p className="text-gray-500">No newsletters shared yet.</p>
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

export default UploadNewsletter;

