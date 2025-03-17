import React from "react";
import { Calendar, Users, MessageSquare } from "lucide-react";

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome to the PTA App</h1>
      <p className="text-gray-600">Stay connected with parents and teachers.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4 rounded-lg shadow-md">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <p className="text-gray-500">Check out the latest PTA meetings and school events.</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">View Calendar</button>
        </div>

        <div className="border p-4 rounded-lg shadow-md">
          <Users className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold">Parents & Teachers</h2>
          <p className="text-gray-500">Connect with members of the PTA community.</p>
          <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded">View Directory</button>
        </div>

        <div className="border p-4 rounded-lg shadow-md">
          <MessageSquare className="w-6 h-6 text-purple-500" />
          <h2 className="text-lg font-semibold">Announcements</h2>
          <p className="text-gray-500">Stay updated with important messages.</p>
          <button className="mt-2 px-4 py-2 bg-purple-500 text-white rounded">View Announcements</button>
        </div>
      </div>
    </div>
  );
};

export default Home;