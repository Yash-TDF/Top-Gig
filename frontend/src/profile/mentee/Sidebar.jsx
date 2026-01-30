import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { id: "call-booking", name: "Call Booking", icon: VideoCameraIcon },
  { id: "certification", name: "Certification", icon: CheckBadgeIcon },
  { id: "edit-profile", name: "Edit Profile", icon: HomeIcon },
  { id: "settings", name: "Settings", icon: Cog6ToothIcon },
];

const Sidebar = ({ currentView, setView }) => {
  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/mentee/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch mentee profile");
        return res.json();
      })
      .then((data) => setMentee(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full">
      {/* Logo */}
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-blue-900">TopGig</h1>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mb-8 px-4 text-center">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading profile...</p>
        ) : mentee ? (
          <>
            <div className="relative">
              <img
                src={
                  mentee.profile_pic
                    ? `http://localhost:8000/${mentee.profile_pic}`
                    : "/avatar.png"
                }
                className="w-20 h-20 rounded-full border-4 border-blue-50 object-cover"
                alt="Profile"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>

            <h3 className="mt-4 font-bold">
              {mentee.name || "Mentee"}
            </h3>

            <p className="text-xs text-slate-400">
              {mentee.bio || "Mentee"}
            </p>
          </>
        ) : (
          <p className="text-red-400 text-sm">Profile not found</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition ${
              currentView === id
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{name}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t">
        <button className="flex items-center gap-3 text-slate-400 hover:text-red-500">
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span className="font-bold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
