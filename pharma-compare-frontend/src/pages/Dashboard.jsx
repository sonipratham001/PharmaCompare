import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState(null); // User details
  const [favorites, setFavorites] = useState([]); // Favorites list
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch user details and favorites
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // Fetch user details
      const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data);

      // Fetch user's favorite medicines
      const favoritesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favoritesResponse.data);
    } catch (err) {
      console.error("Error fetching user data:", err.response || err.message);
      setError("Invalid token. Please log in again.");
      localStorage.removeItem("token"); // Clear invalid token
      setTimeout(() => {
        navigate("/"); // Redirect to login page
      }, 1500); // Delay redirect to show error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on mount
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Remove medicine from favorites
  const handleRemoveFavorite = async (medicineId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/favorites/${medicineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((fav) => fav._id !== medicineId));
      toast.success("Removed from favorites.");
    } catch (err) {
      console.error("Error removing favorite:", err.message);
      toast.error("Failed to remove favorite.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 text-lg">Loading...</p>;

  if (error)
    return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      {/* Navbar */}
      <div className="bg-blue-500 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">PharmaCompare</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={() => navigate("/home")}
                  className="btn btn-secondary text-white hover:bg-blue-700"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/search-results")}
                  className="btn btn-secondary text-white hover:bg-blue-700"
                >
                  Search Medicines
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/profile")}
                  className="btn btn-secondary text-white hover:bg-blue-700"
                >
                  View Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/add-medicine")}
                  className="btn btn-secondary text-white hover:bg-blue-700"
                >
                  Add Medicine
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/add-pharmacy")}
                  className="btn btn-secondary text-white hover:bg-blue-700"
                >
                  Add Pharmacy
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <h2 className="text-5xl font-bold text-blue-900 mb-2">
          Welcome to PharmaCompare
        </h2>
        <p className="text-lg text-gray-600">
          Hello {user?.username || "User"}! Manage your medicines and pharmacies with ease.
        </p>
      </div>

      {/* User Details */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
        {user ? (
          <>
            <p className="text-gray-700 text-lg">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Favorites:</strong> {favorites.length}
            </p>
          </>
        ) : (
          <p className="text-gray-600">No user information available.</p>
        )}
      </div>

      {/* Favorites Section */}
      <h2 className="text-2xl font-bold text-center mb-8 text-blue-900">
        Your Favorites
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.length > 0 ? (
          favorites.map((medicine) => (
            <div
              key={medicine._id}
              className="card bg-white shadow-md p-4 rounded-lg hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {medicine.name}
              </h3>
              <p className="text-gray-600">{medicine.description || "No description available"}</p>
              <button
                className="btn btn-danger mt-4 w-full hover:bg-red-700"
                onClick={() => handleRemoveFavorite(medicine._id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">You have no favorite medicines.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;