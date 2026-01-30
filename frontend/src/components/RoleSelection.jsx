import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  const selectRole = async (role) => {
  await fetch(`http://localhost:8000/auth/set-role?role=${role}`, {
    method: "POST",
    credentials: "include", 
  });
  navigate(`/create-profile/${role}`);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-2">
          What role suits you?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Choose how you want to use the platform
        </p>

        {/* Mentor Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-5 hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Mentor"
              className="w-14 h-14"
            />
            <div>
              <h3 className="text-lg font-bold text-blue-700">Mentor</h3>
              <p className="text-sm text-gray-600 mt-1">
                Guide others, share experience, and help mentees grow in their
                careers.
              </p>
            </div>
          </div>

          <button
            onClick={() => selectRole("Mentor")}
            className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Continue as Mentor
          </button>
        </div>

        {/* Mentee Card */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
              alt="Mentee"
              className="w-14 h-14"
            />
            <div>
              <h3 className="text-lg font-bold text-green-700">Mentee</h3>
              <p className="text-sm text-gray-600 mt-1">
                Learn from mentors, get guidance, and accelerate your growth.
              </p>
            </div>
          </div>

          <button
            onClick={() => selectRole("Mentee")}
            className="mt-5 w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Continue as Mentee
          </button>
        </div>

      </div>
    </div>
  );
}
