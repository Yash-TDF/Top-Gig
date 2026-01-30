import { useEffect, useMemo, useState } from "react";

function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔍 Search */
  const [search, setSearch] = useState("");

  /* 🎯 Filters */
  const [filters, setFilters] = useState({
    language: "",
    timezone: "",
    expertise: "",
    session: "",
    country: "",
  });

  /* ↕ Sorting */
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/mentee/mentors", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch mentors");
        return res.json();
      })
      .then((data) => setMentors(Array.isArray(data) ? data : []))
      .catch(() => setMentors([]))
      .finally(() => setLoading(false));
  }, []);

  /* 🧠 Filter + Search + Sort Logic */
  const filteredMentors = useMemo(() => {
    let list = [...mentors];

    /* Search */
    if (search) {
      list = list.filter((m) =>
        `${m.name} ${m.headline}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    /* Filters */
    if (filters.language)
      list = list.filter((m) => m.language === filters.language);

    if (filters.timezone)
      list = list.filter((m) => m.timezone === filters.timezone);

    if (filters.expertise)
      list = list.filter((m) => m.expertise === filters.expertise);

    if (filters.session)
      list = list.filter(
        (m) => String(m.session_duration) === filters.session
      );

    if (filters.country)
      list = list.filter((m) => m.country === filters.country);

    /* Sorting */
    switch (sortBy) {
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "availability":
        list.sort(
          (a, b) =>
            new Date(a.next_available_at) -
            new Date(b.next_available_at)
        );
        break;
      default:
        break;
    }

    return list;
  }, [mentors, search, filters, sortBy]);

  if (loading) return <p className="text-slate-400">Loading mentors...</p>;
  if (!filteredMentors.length)
    return <p className="text-slate-400">No mentors found</p>;
  const FILTER_OPTIONS = {
  language: ["English", "Hindi", "Spanish"],
  timezone: ["UTC+5:30", "UTC+1", "UTC-5"],
  expertise: ["Frontend", "Backend", "DSA", "System Design"],
  session: ["30", "60"],
  country: ["India", "USA", "Germany"],
};
  return (
    <div className="space-y-6">
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search mentors by name or role"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl border bg-white"
      />

      {/* 🎯 Filters & Sort */}
      <div className="flex flex-wrap gap-3 text-sm">
        {/* Language */}
        <select
            value={filters.language}
            onChange={(e) =>
            setFilters({ ...filters, language: e.target.value })
            }
            className="px-3 py-2 rounded-lg border bg-white"
        >
            <option value="">Language</option>
            {FILTER_OPTIONS.language.map((lang) => (
            <option key={lang} value={lang}>
                {lang}
            </option>
            ))}
        </select>

        {/* Timezone */}
        <select
            value={filters.timezone}
            onChange={(e) =>
            setFilters({ ...filters, timezone: e.target.value })
            }
            className="px-3 py-2 rounded-lg border bg-white"
        >
            <option value="">Timezone</option>
            {FILTER_OPTIONS.timezone.map((tz) => (
            <option key={tz} value={tz}>
                {tz}
            </option>
            ))}
        </select>

        {/* Expertise */}
        <select
            value={filters.expertise}
            onChange={(e) =>
            setFilters({ ...filters, expertise: e.target.value })
            }
            className="px-3 py-2 rounded-lg border bg-white"
        >
            <option value="">Expertise</option>
            {FILTER_OPTIONS.expertise.map((exp) => (
            <option key={exp} value={exp}>
                {exp}
            </option>
            ))}
        </select>

        {/* Session Block */}
        <select
            value={filters.session}
            onChange={(e) =>
            setFilters({ ...filters, session: e.target.value })
            }
            className="px-3 py-2 rounded-lg border bg-white"
        >
            <option value="">Session</option>
            {FILTER_OPTIONS.session.map((s) => (
            <option key={s} value={s}>
                {s} min
            </option>
            ))}
        </select>

        {/* Country */}
        <select
            value={filters.country}
            onChange={(e) =>
            setFilters({ ...filters, country: e.target.value })
            }
            className="px-3 py-2 rounded-lg border bg-white"
        >
            <option value="">Country</option>
            {FILTER_OPTIONS.country.map((c) => (
            <option key={c} value={c}>
                {c}
            </option>
            ))}
        </select>

        {/* Sorting */}
        <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white"
        >
            <option value="">Sort By</option>
            <option value="availability">Next Availability</option>
            <option value="rating">Ratings</option>
            <option value="newest">Newest Added</option>
        </select>
        </div>


      {/* 👥 Mentor Cards */}
      <div className="space-y-4">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white p-4 rounded-xl border flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  mentor.profile_pic
                    ? `http://localhost:8000/${mentor.profile_pic}`
                    : "/mentor-avatar.png"
                }
                className="w-12 h-12 rounded-full object-cover"
                alt={mentor.name}
              />
              <div>
                <h4 className="font-bold">{mentor.name}</h4>
                <p className="text-xs text-slate-400">
                  {mentor.headline || "Mentor"}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                window.open("https://meet.google.com/xyz", "_blank")
              }
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
            >
              Join Call
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentorList;
