import { useEffect, useState } from "react";

function MenteeDashboard() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/mentee/mentors", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setMentors(data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mentee Dashboard</h1>
        <button
          onClick={() => window.location.href = "/edit-profile"}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Edit Profile
        </button>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map(m => (
          <div
            key={m.id}
            className="bg-white rounded-3xl p-5 shadow-xl hover:scale-[1.02] transition"
          >
            <img
              src={m.profile_pic || "/mentor-avatar.png"}
              className="w-20 h-20 rounded-full object-cover mx-auto"
            />
            <h2 className="text-xl font-bold mt-4 text-center">{m.name}</h2>
            <p className="text-gray-500 text-center text-sm mt-1">
              {m.headline}
            </p>

            <button
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl"
            >
              Join Call
            </button>
          </div>
        ))}
      </div>

      {/* Session Section */}
      <div className="mt-10 bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold mb-2">Your Sessions</h2>
        <p className="text-gray-500">
          No sessions scheduled yet.
        </p>
      </div>

      {/* Settings */}
      <div className="mt-6 flex gap-4">
        <button className="px-4 py-2 bg-gray-200 rounded-xl">
          Settings
        </button>
        <button
          onClick={() => {
            document.cookie = "access_token=; Max-Age=0";
            window.location.href = "/login";
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default MenteeDashboard;
