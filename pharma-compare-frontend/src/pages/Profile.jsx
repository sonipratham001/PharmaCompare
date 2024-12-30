import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null); // State to store user details
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user details and favorites
  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      // Fetch user details
      const userResponse = await axios.get("http://localhost:5001/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data);

      // Fetch favorites
      const favoritesResponse = await axios.get("http://localhost:5001/users/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favoritesResponse.data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to fetch profile data");
      toast.error("Failed to fetch profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const handleRemoveFavorite = async (medicineId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/users/favorites/${medicineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((fav) => fav._id !== medicineId));
      toast.success("Removed from favorites successfully!");
    } catch (err) {
      console.error("Error removing favorite:", err);
      toast.error("Failed to remove favorite. Please try again.");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl mb-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">My Profile</h1>
        {user ? (
          <div className="profile-box text-center">
            <p className="text-lg font-medium text-gray-800">
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p className="text-lg font-medium text-gray-800">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No user information available</p>
        )}
      </div>

      {/* Favorites Section */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">My Favorites</h2>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((medicine) => (
            <div
              key={medicine._id}
              className="card bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">{medicine.name}</h3>
              <p className="text-gray-600">{medicine.description || "No description available"}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="btn bg-red-500 text-black hover:bg-red-600 rounded-full py-2 px-4 transition-all duration-300"
                  onClick={() => handleRemoveFavorite(medicine._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">No favorites added yet.</p>
      )}
    </div>
  );
};

export default Profile;