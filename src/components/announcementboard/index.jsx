import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnnouncementBoard = () => {
  const navigate = useNavigate();

  // Dummy announcements data
  const announcements = [
    {
      id: 1,
      title: "School Meeting",
      date: "2025-03-20",
      content: "Don't forget about the PTA meeting scheduled for March 20th at 5 PM in the school auditorium.",
    },
    {
      id: 2,
      title: "Holiday Schedule",
      date: "2025-03-18",
      content: "The updated holiday schedule has been posted. Please check the website for details on school closures.",
    },
    {
      id: 3,
      title: "New Student Orientation",
      date: "2025-03-22",
      content: "Orientation for new students will take place on March 22nd. Make sure to RSVP by the end of this week.",
    },
  ];

  return (
    <div className="p-6 mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Announcements Board</h1>
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Home
        </button>
      </div>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{announcement.title}</h2>
            <p className="text-gray-500 text-sm">{announcement.date}</p>
            <p className="mt-2">{announcement.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBoard;
