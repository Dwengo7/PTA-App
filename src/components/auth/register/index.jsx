import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';

const Register = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    const db = getFirestore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('parent'); // Default to parent
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
    }

    setIsRegistering(true);
    try {
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // ✅ Convert email to lowercase before storing
        const lowercaseEmail = email.toLowerCase();

        await setDoc(doc(db, 'users', uid), {
            email: lowercaseEmail,
            role: userType, // 'teacher' or 'parent'
            requestedSchool: "", // School will be set in the next step
            school: "",
            isApproved: false,
            createdAt: new Date()
        });

        // Redirect to school selection instead of home
        navigate('/schoolselection');
    } catch (error) {
        console.error("Error during registration:", error);
        setErrorMessage(error.message);
    }
    setIsRegistering(false);
};


    return (
        <div>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <main className="w-full h-screen flex justify-center items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <h3 className="text-gray-800 text-xl font-semibold text-center">Create a New Account</h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-2 p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">User Type</label>
                            <select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                className="w-full mt-2 p-2 border rounded-lg"
                            >
                                <option value="parent">Parent</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>

                        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

                        <button type="submit" disabled={isRegistering} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <p className="text-center text-sm">
                            Already have an account? <Link to={'/login'} className="hover:underline font-bold">Login</Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;

