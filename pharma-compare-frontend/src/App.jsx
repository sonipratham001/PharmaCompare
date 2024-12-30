import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import MedicineDetails from "./pages/MedicineDetails";
import Profile from "./pages/Profile";
import AddMedicine from "./pages/AddMedicine"; // Import AddMedicine component
import AddPharmacy from "./pages/AddPharmacy"; // Import AddPharmacy component
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-results"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicine-details/:id"
            element={
              <ProtectedRoute>
                <MedicineDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-medicine"
            element={
              <ProtectedRoute>
                <AddMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-pharmacy"
            element={
              <ProtectedRoute>
                <AddPharmacy />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      {/* ToastContainer ensures toast notifications can appear globally */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;