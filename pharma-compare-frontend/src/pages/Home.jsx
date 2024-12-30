import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]); // State for medicines
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch medicines from the backend
  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`); // Fetch medicines
      setMedicines(response.data); // Set medicines in state
    } catch (err) {
      console.error("Error fetching medicines:", err.message);
      setError("Failed to load medicines. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Add to Favorites handler
  const handleAddToFavorites = async (medicineId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to add favorites.");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/favorites`,
        { medicineId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message || "Medicine added to favorites!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add to favorites.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchMedicines(); // Fetch medicines on mount
  }, []);

  return (
    <div className="p-8 bg-gradient-to-r from-green-50 to-blue-50 min-h-screen">
      {/* Banner Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <div className="bg-blue-500 text-white py-12 px-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to PharmaCompare</h1>
          <p className="text-lg">
            Discover and manage medicines, compare prices, and find the best
            pharmacies near you.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="text-center mb-8">
        <button
          className="btn btn-info text-lg px-6 py-3 rounded-full shadow-md"
          onClick={() => navigate("/search-results")}
        >
          Search Medicines
        </button>
      </div>

      {/* Featured Medicines Section */}
      <h2 className="text-3xl font-bold mb-6 text-center">Featured Medicines</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading medicines...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {medicines.map((medicine) => (
            <div
              key={medicine._id}
              className="card bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {medicine.name}
              </h3>
              <p className="text-gray-600 mt-2">
                <strong>Price:</strong> ${medicine.price || "N/A"}
              </p>
              <div className="mt-4">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => handleAddToFavorites(medicine._id)}
                >
                  Add to Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;