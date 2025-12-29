import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import TutorCard from "../components/TutorCard";

const stats = [
  {
    title: "Total Bookings",
    value: "12",
    icon: "📅",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Active Tutors",
    value: "5",
    icon: "🧑‍🏫",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Wallet Balance",
    value: "₹1,250",
    icon: "💰",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Completed Sessions",
    value: "34",
    icon: "🎯",
    color: "bg-purple-100 text-purple-600",
  },
];

const recentBookings = [
  {
    id: 1,
    tutor: "Rahul Sharma",
    subject: "Mathematics",
    date: "25 Sep 2025",
    status: "Upcoming",
  },
  {
    id: 2,
    tutor: "Anita Verma",
    subject: "English",
    date: "20 Sep 2025",
    status: "Completed",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth token
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Decode token to get user info (simple version)
    try {
      // In real app, decode JWT token here
      setUser({ name: "Nhaman Bhai", email: "nhamanbhai@gmail.com" });
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Welcome back {user?.name.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your learning today
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg"
          >
            Logout
          </button>
        </div>

        <div className="space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <StatsCard key={index} {...item} />
            ))}
          </div>

          {/* RECENT BOOKINGS */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Recent Bookings
              </h2>
              <button className="text-[#0852A1] font-semibold hover:underline text-lg">
                View All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="text-left py-4 font-medium">Tutor</th>
                    <th className="text-left py-4 font-medium">Subject</th>
                    <th className="text-left py-4 font-medium">Date</th>
                    <th className="text-left py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">{booking.tutor}</td>
                      <td className="py-4 text-gray-700">{booking.subject}</td>
                      <td className="py-4 text-gray-700">{booking.date}</td>
                      <td>
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-semibold ${
                            booking.status === "Completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* POPULAR TUTORS */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Popular Tutors
              </h2>
              <button className="text-[#0852A1] font-semibold hover:underline text-lg">
                Explore Tutors →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <TutorCard
                name="Rahul Sharma"
                subject="Mathematics"
                rating={4.8}
              />
              <TutorCard
                name="Anita Verma"
                subject="English"
                rating={4.6}
              />
              <TutorCard
                name="Amit Singh"
                subject="Science"
                rating={4.7}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
