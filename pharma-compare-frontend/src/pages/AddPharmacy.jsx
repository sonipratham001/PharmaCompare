import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddPharmacy = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState([]); // Store selected medicines with prices
  const [loading, setLoading] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]); // Store medicine options from backend

  // Fetch medicine options from backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`);
        setMedicineOptions(response.data); // Store fetched medicines
      } catch (err) {
        console.error("Error fetching medicines:", err);
        toast.error("Failed to fetch medicines.");
      }
    };

    fetchMedicines();
  }, []);

  const handleAddMedicine = () => {
    setSelectedMedicines([...selectedMedicines, { medicine: "", price: "" }]);
  };

  const handleMedicineChange = (index, key, value) => {
    const updatedMedicines = [...selectedMedicines];
    updatedMedicines[index][key] = value;
    setSelectedMedicines(updatedMedicines);
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...selectedMedicines];
    updatedMedicines.splice(index, 1);
    setSelectedMedicines(updatedMedicines);
  };

  const handleAddPharmacy = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const medicinesArray = selectedMedicines.map((item) => ({
        name: item.medicine, // Send only the name of the medicine
        price: parseFloat(item.price),
      }));

      await axios.post(`${import.meta.env.VITE_API_URL}/pharmacies`, {
        name,
        address,
        medicines: medicinesArray, // Send medicines with names and prices
      });

      toast.success("Pharmacy added successfully!");
      setName("");
      setAddress("");
      setSelectedMedicines([]);
    } catch (err) {
      console.error("Error adding pharmacy:", err);
      toast.error(
        err.response?.data?.error || "Failed to add pharmacy. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Pharmacy</h1>
        <form onSubmit={handleAddPharmacy}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Pharmacy Name
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
              Address
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-white text-black"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Medicines
            </label>
            {selectedMedicines.map((item, index) => (
              <div key={index} className="mb-2 flex items-center">
                <select
                  className="select select-bordered bg-white text-black mr-2 flex-grow"
                  value={item.medicine}
                  onChange={(e) =>
                    handleMedicineChange(index, "medicine", e.target.value)
                  }
                  required
                >
                  <option value="">Select Medicine</option>
                  {medicineOptions.map((medicine) => (
                    <option key={medicine._id} value={medicine.name}>
                      {medicine.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  className="input input-bordered bg-white text-black mr-2 w-24"
                  value={item.price}
                  onChange={(e) =>
                    handleMedicineChange(index, "price", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => handleRemoveMedicine(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={handleAddMedicine}
            >
              Add Medicine
            </button>
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Pharmacy"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPharmacy;