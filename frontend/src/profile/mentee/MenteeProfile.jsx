import { useState } from "react";

function CreateMenteeProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [success, setSuccess] = useState(false);
  const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/thumbs/svg?seed=mentee";

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (photo) formData.append("photo", photo);

    const res = await fetch("http://localhost:8000/auth/create-profile/mentee", {
      method: "POST",
      credentials: "include",
      body: formData
    });
    if (!res.ok) {
    const err = await res.json();
    alert(err.detail || "Failed to create profile");
    return;
    }
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/90 rounded-3xl p-8 shadow-2xl">
        {!success ? (
          <>
            <h2 className="text-2xl font-extrabold text-center text-gray-800">
              Create your mentee profile
            </h2>
            <p className="text-center text-sm text-gray-500 mt-1">
              Let mentors know who you are
            </p>

            {/* Avatar Upload */}
            <div className="mt-6 flex justify-center">
              <label className="relative cursor-pointer group">
                <img
                  src={
                    photo ? URL.createObjectURL(photo) : DEFAULT_AVATAR
                  }
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-400 group-hover:ring-pink-400 transition"
                  alt="Avatar"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <span className="text-white text-sm font-semibold">
                    Upload
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </label>
            </div>

            {/* Name */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-600">
                Bio
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tell mentors about your goals, interests, or background"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold tracking-wide hover:opacity-90 transition"
            >
              Continue
            </button>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-10">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl">
              ✓
            </div>
            <h2 className="text-2xl font-extrabold mt-6 text-gray-800">
              Profile Created 🎉
            </h2>
            <p className="text-gray-500 mt-2">
              You’re all set to connect with mentors.
            </p>
            <button
              onClick={() => (window.location.href = "/mentee-dashboard")}
              className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateMenteeProfile;