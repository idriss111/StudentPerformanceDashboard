import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserInfoDisplay = () => {
    const location = useLocation();
    const userData = location.state?.userData;
    const navigate = useNavigate();

    if (!userData) {
        // Redirect back if no data
        navigate('/');
        return null;
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-[#00b1ac] mb-4">Welcome, {userData.firstName}!</h2>
                <div className="space-y-2 text-gray-700">
                    <p><strong>Last Name:</strong> {userData.lastName}</p>
                    <p><strong>Study Program:</strong> {userData.studyProgram}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoDisplay;