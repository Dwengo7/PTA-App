import React from "react";
import { Calendar, Users, MessageSquare, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherHome = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 mt-12 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, Teacher</h1>
      <p className="text-gray-600">Manage your announcements, schedule, and communications.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Teacher Calendar */}
        <div className="border p-4 rounded-lg shadow-md">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Teacher Calendar</h2>
          <p className="text-gray-500">Plan and manage class schedules & meetings.</p>
          <button
            onClick={() => navigate('/teachercalendar')}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            View Calendar
          </button>
        </div>

        {/* Teacher Directory */}
        <div className="border p-4 rounded-lg shadow-md">
          <Users className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold">Teacher Directory</h2>
          <p className="text-gray-500">Connect with fellow teachers and parents.</p>
          <button
            onClick={() => navigate('/teacherdirectory')}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            View Directory
          </button>
        </div>

        {/* Teacher Announcements */}
        <div className="border p-4 rounded-lg shadow-md">
          <MessageSquare className="w-6 h-6 text-purple-500" />
          <h2 className="text-lg font-semibold">Manage Announcements</h2>
          <p className="text-gray-500">Post and manage school-wide updates.</p>
          <button
            onClick={() => navigate('/teacherannouncements')}
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded"
          >
            View Announcements
          </button>
        </div>

        {/* Upload Newsletter */}
        <div className="border p-4 rounded-lg shadow-md">
          <FileText className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-semibold">Upload Newsletter</h2>
          <p className="text-gray-500">Upload and share school newsletters.</p>
          <button
            onClick={() => navigate('/uploadnewsletter')}
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
          >
            Upload Newsletter
          </button>
        </div>

        {/* Review Pending Approvals */}
        <div className="border p-4 rounded-lg shadow-md">
          <CheckCircle className="w-6 h-6 text-teal-500" />
          <h2 className="text-lg font-semibold">Review Pending Approvals</h2>
          <p className="text-gray-500">Approve or reject users requesting to join your school.</p>
          <button
            onClick={() => navigate('/teacherapproval')}
            className="mt-2 px-4 py-2 bg-teal-500 text-white rounded"
          >
            View Approvals
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
