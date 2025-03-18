import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Login = () => {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const db = getFirestore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [role, setRole] = useState(null); // Track user role

    // Function to handle login
    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);

        try {
            // Sign in with Firebase Auth
            const userCredential = await doSignInWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;

            console.log("User logged in, fetching role...");

            // Fetch role from Firestore
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setRole(userData.role); // Save role to state
                console.log(`User role: ${userData.role}`);

                // Redirect based on role
                if (userData.role === 'teacher') {
                    console.log("Redirecting to Teacher Home Page...");
                    navigate('/teacherhome'); // ✅ Teacher redirect
                } else {
                    console.log("Redirecting to Parent Home Page...");
                    navigate('/home'); // ✅ Parent redirect
                }
            } else {
                setErrorMessage('User data not found.');
            }
        } catch (error) {
            console.error("Error signing in:", error);
            setErrorMessage(error.message);
        } finally {
            setIsSigningIn(false);
        }
    };

    // Prevent incorrect redirects until role is determined
    useEffect(() => {
        if (userLoggedIn && role === null) {
            console.log("Waiting for role...");
            return;
        }
        if (role === 'teacher') navigate('/teacherhome');
        else if (role === 'parent') navigate('/home');
    }, [userLoggedIn, role, navigate]);

    return (
        <div>
            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center">
                        <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Welcome Back</h3>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm text-gray-600 font-bold">Email</label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">Password</label>
                            <input
                                type="password"
                                autoComplete='current-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-sm">Don't have an account? <Link to={'/register'} className="hover:underline font-bold">Sign up</Link></p>
                </div>
            </main>
        </div>
    );
};

export default Login;

