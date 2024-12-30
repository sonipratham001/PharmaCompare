import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddMedicine = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pharmacies, setPharmacies] = useState([]); // Selected pharmacy names
  const [availablePharmacies, setAvailablePharmacies] = useState([]); // List of pharmacies for dropdown
  const [loading, setLoading] = useState(false);

  // Fetch pharmacies for dropdown
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/pharmacies`);
        setAvailablePharmacies(response.data); // Store fetched pharmacies
      } catch (err) {
        console.error("Error fetching pharmacies:", err);
        toast.error("Failed to fetch pharmacies. Please try again.");
      }
    };
    fetchPharmacies();
  }, []);

  // Handle form submission
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sending pharmacy names instead of IDs
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/medicines`, {
        name,
        description,
        price: parseFloat(price),
        pharmacies, // Send the names directly
      });
      toast.success("Medicine added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setPharmacies([]);
    } catch (err) {
      console.error("Error adding medicine:", err);
      toast.error(
        err.response?.data?.error || "Failed to add medicine. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Medicine</h1>
        <form onSubmit={handleAddMedicine}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Medicine Name
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-white text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-white text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Price</label>
            <input
              type="number"
              className="input input-bordered w-full bg-white text-black"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Pharmacies
            </label>
            <div className="relative">
              <select
                multiple
                className="select select-bordered w-full bg-white text-black rounded-md p-2 h-40 overflow-auto shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pharmacies}
                onChange={(e) =>
                  setPharmacies(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
              >
                {availablePharmacies.map((pharmacy) => (
                  <option
                    key={pharmacy._id}
                    value={pharmacy.name} // Set value to the pharmacy name
                    className="py-1 hover:bg-blue-100"
                  >
                    {pharmacy.name}
                  </option>
                ))}
              </select>
              <p className="text-gray-500 mt-1 text-sm">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple pharmacies.
              </p>
            </div>
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Medicine"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;