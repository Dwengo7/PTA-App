import React from "react";
import { Calendar, Users, MessageSquare, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 mt-12 space-y-6">
      <h1 className="text-2xl font-bold">Welcome to the PTA App</h1>
      <p className="text-gray-600">Stay connected with parents and teachers.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Upcoming Events */}
        <div className="border p-4 rounded-lg shadow-md">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <p className="text-gray-500">Check out the latest PTA meetings and school events.</p>
          <button
            onClick={() => navigate('/calendar')}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            View Calendar
          </button>
        </div>

        {/* Parent & Teacher Directory */}
        <div className="border p-4 rounded-lg shadow-md">
          <Users className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold">Parents & Teachers</h2>
          <p className="text-gray-500">Connect with members of the PTA community.</p>
          <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
            View Directory
          </button>
        </div>

        {/* Announcements */}
        <div className="border p-4 rounded-lg shadow-md">
          <MessageSquare className="w-6 h-6 text-purple-500" />
          <h2 className="text-lg font-semibold">Announcements</h2>
          <p className="text-gray-500">Stay updated with important messages.</p>
          <button
            onClick={() => navigate('/announcements')}
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded"
          >
            View Announcements
          </button>
        </div>

        {/* Parent Newsletters */}
        <div className="border p-4 rounded-lg shadow-md">
          <FileText className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-semibold">Newsletters</h2>
          <p className="text-gray-500">Access the latest school newsletters.</p>
          <button
            onClick={() => navigate('/parentnewsletters')}
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
          >
            View Newsletters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

