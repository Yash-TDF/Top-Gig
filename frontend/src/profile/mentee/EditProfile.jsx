import { useEffect, useState } from "react";

function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    profile_pic: null,
    name: "",
    bio: "",
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/mentee/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setProfile({
          profile_pic: data.profile_pic || null,
          name: data.name || "",
          bio: data.bio || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("bio", profile.bio);
    if (photo) formData.append("photo", photo);

    const res = await fetch(
      "http://localhost:8000/mentee/update-profile",
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      }
    );

    if (!res.ok) {
      alert("Failed to update profile");
      return;
    }

    alert("Profile updated successfully ✅");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      <form onSubmit={updateProfile} className="space-y-4">
        {/* Profile Pic */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Full Name
          </label>
          <input
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            className="w-full p-3 border rounded-lg bg-slate-50"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Bio
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) =>
              setProfile({ ...profile, bio: e.target.value })
            }
            className="w-full p-3 border rounded-lg bg-slate-50"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
