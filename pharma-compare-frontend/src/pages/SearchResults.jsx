import React, { useState } from "react";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom"; // Add this import
import { toast } from "react-toastify";


const SearchResults = () => {
  const navigate = useNavigate(); // Now useNavigate will be defined here
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [results, setResults] = useState([]); // Store search results
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state

  // Function to fetch medicines
  const fetchMedicines = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/medicines?search=${searchQuery}` // No Authorization required
      );
      setResults(response.data); // Save results
      if (response.data.length > 0) {
        toast.success("Medicines fetched successfully!");
      } else {
        toast.info("No medicines found matching your search.");
      }
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setError("Failed to fetch search results. Please try again.");
      toast.error("Failed to fetch medicines!");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding to favorites
  const handleAddToFavorites = async (medicineId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token missing. Please log in.");
        return;
      }
      const response = await axios.post(
        "http://localhost:5001/users/favorites",
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Search Medicines</h1>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row w-full max-w-lg mb-6">
        <input
          type="text"
          className="input input-bordered w-full text-black bg-white mb-4 md:mb-0 md:mr-2 focus:ring-2 focus:ring-blue-400"
          placeholder="Enter medicine name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={fetchMedicines}
          className="btn btn-primary w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          disabled={!searchQuery.trim() || loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {results.length > 0 ? (
          results.map((medicine) => (
            <div
              key={medicine._id}
              className="card bg-white shadow-md p-4 md:p-6 rounded-lg hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-gray-800">{medicine.name || "No Name Available"}</h3>
              <p className="text-gray-600">
                <strong>Price:</strong> ${medicine.price || "N/A"}
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  className="btn btn-secondary bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                  onClick={() => handleAddToFavorites(medicine._id)}
                >
                  Add to Favorites
                </button>
                <button
                  className="btn btn-info bg-green-500 hover:bg-green-600 text-white font-semibold"
                  onClick={() => navigate(`/medicine-details/${medicine._id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;