import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
         You are not logged in.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full text-gray-800">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-inner">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-extrabold text-blue-700 mb-2">Welcome, {user.name}!</h2>
          <p className="text-gray-600 mb-6">Here are your profile details:</p>
        </div>

        <div className="space-y-3 text-sm bg-blue-50 rounded-lg p-4 shadow-inner">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600"> Name</span>
            <span className="text-gray-800">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600"> Email</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600"> User ID</span>
            <span className="text-gray-800 truncate max-w-[60%] text-right">{user.id}</span>
          </div>
        </div>

        <div className="mt-6 text-xs text-center text-gray-400 italic">
          Your profile is secure and synced with your account.
        </div>
      </div>
    </div>
  );
};

export default Profile;
