import { Navigate } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./components/home";
import TeacherHome from "./components/teacherhome";
import CalendarPage from "./components/calendar"; 
import AnnouncementBoard from "./components/announcementboard";
import TeacherAnnouncementBoard from "./components/teacherannouncementboard";
import TeacherCalendar from "./components/teachercalendar";
import UploadNewsletter from "./components/newsletter";
import ParentNewsletters from "./components/parentnewsletter";
import SchoolSelection from "./components/schoolselection";
import PendingApproval from "./components/pendingapproval";
import TeacherApproval from "./components/teacherapproval";
import TeacherDirectory from "./components/teacherdirectory";
import TeacherClasses from "./components/teacherclasses";
import ManageStudents from "./components/managestudent";
import ParentTeacherDirectory from "./components/parentteacherdirectory"; 
import TeacherMessageParents from "./components/teachermessageparents";
import ParentMessages from "./components/parentmessages";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/teacherhome", element: <TeacherHome /> },
    { path: "/calendar", element: <CalendarPage /> },
    { path: "/announcements", element: <AnnouncementBoard /> },
    { path: "/teacherannouncements", element: <TeacherAnnouncementBoard /> },
    { path: "/teachercalendar", element: <TeacherCalendar /> },
    { path: "/uploadnewsletter", element: <UploadNewsletter /> },
    { path: "/parentnewsletters", element: <ParentNewsletters /> },
    { path: "/schoolselection", element: <SchoolSelection /> },
    { path: "/pendingapproval", element: <PendingApproval /> },
    { path: "/teacherapproval", element: <TeacherApproval /> },
    { path: "/teacherdirectory", element: <TeacherDirectory /> },
    { path: "/teacherclasses", element: <TeacherClasses /> },
    { path : "/managestudents", element: <ManageStudents /> },
    { path: "/parentteacherdirectory", element: <ParentTeacherDirectory /> }, // Assuming this is a duplicate of the teacher directory
    { path : "/teachermessageparents", element: <TeacherMessageParents /> },
    { path : "/parentmessages", element: <ParentMessages /> },

    { path: "*", element: <Navigate to="/login" replace /> }, // Redirect unknown routes to login
  ];

  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;