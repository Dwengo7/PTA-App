import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLoggedIn } = useAuth();

  // Determine if we should show the Back to Home button
  const showBackToHome = ['/calendar', '/parentnewsletters', '/announcements'].includes(location.pathname);

  const showBackToTeacherHome = ['/teachercalendar', '/teacherannouncements', '/uploadnewsletter', '/teacherapproval'].includes(location.pathname);

  

  return (
    <nav className="flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200">
      {showBackToHome && (
        <button
          onClick={() => navigate('/home')}
          className="text-sm text-blue-600 underline"
        >
          Back to Home
        </button>
      )}

      {showBackToTeacherHome && (
        <button
          onClick={() => navigate('/teacherhome')}
          className="text-sm text-blue-600 underline"
        >
          Back to Home
        </button>
      )}

      {userLoggedIn ? (
        <button
          onClick={() => {
            doSignOut().then(() => {
              navigate('/login');
            });
          }}
          className="text-sm text-blue-600 underline"
        >
          Logout
        </button>
      ) : (
        <>
          <Link className="text-sm text-blue-600 underline" to="/login">
            Login
          </Link>
          <Link className="text-sm text-blue-600 underline" to="/register">
            Register New Account
          </Link>
        </>
      )}
    </nav>
  );
};

export default Header;
