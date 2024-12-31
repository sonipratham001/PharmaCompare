import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MedicineDetails = () => {
  const { id } = useParams(); // Extract the medicine ID from the URL
  const [medicine, setMedicine] = useState(null); // State to store medicine details
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch medicine details
  const fetchMedicineDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/medicines/${id}`);
      setMedicine(response.data); // Save medicine details
    } catch (err) {
      console.error("Error fetching medicine details:", err.message);
      setError("Failed to fetch medicine details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicineDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {medicine ? (
          <>
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
              {medicine.name}
            </h1>
            <p className="text-gray-600 mb-4">
              <strong>Price:</strong> ${medicine.price || "N/A"}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong>{" "}
              {medicine.description || "No description available."}
            </p>

            {medicine.pharmacies && medicine.pharmacies.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Available at Pharmacies:
                </h3>
                <ul className="space-y-4">
                  {medicine.pharmacies.map((pharmacy) => (
                    <li
                      key={pharmacy.name} // Use pharmacy name as the unique key
                      className="p-4 bg-gray-50 border rounded-lg shadow-sm"
                    >
                      <strong className="block text-lg text-gray-700">
                        {pharmacy.name}
                      </strong>
                      <p className="text-gray-600">{pharmacy.address}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">
                No pharmacies available for this medicine.
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">No details available</p>
        )}
      </div>
    </div>
  );
};

export default MedicineDetails;