import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const VetProfile = ({url}) => {
  const [vet, setVet] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedVet, setUpdatedVet] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUpdatedVet({ ...updatedVet, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
       `${url}/auth/vet/profile`,
        updatedVet,
        { withCredentials: true }
      );
      if (response.data.success) {
        setVet(response.data.vet);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${url}/auth/vet/logout`, {}, { withCredentials: true });
      if (res.data.success) {
        navigate("/vet/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${url}/auth/vet/profile`, { withCredentials: true });
        if (response.data.success) {
          setVet(response.data.vet);
          setUpdatedVet(response.data.vet);
        }
      } catch (error) {
        console.error("Fetch profile failed:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl font-semibold text-indigo-600">
                {vet.name?.charAt(0) || "V"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-indigo-600">Veterinarian Profile</h2>
          </div>

          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedVet.name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={updatedVet.email || ""}
                  readOnly
                  className="w-full px-4 py-2 rounded-md border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={updatedVet.phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={updatedVet.specialization || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={updatedVet.experience || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Clinic</label>
                <input
                  type="text"
                  name="clinic"
                  value={updatedVet.clinic || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Name:</span>
                <span className="text-gray-600">{vet.name || "Not set"}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Email:</span>
                <span className="text-gray-600">{vet.email || "Not set"}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Phone:</span>
                <span className="text-gray-600">{vet.phone || "Not set"}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Specialization:</span>
                <span className="text-gray-600">{vet.specialization || "Not set"}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Experience:</span>
                <span className="text-gray-600">{vet.experience ? `${vet.experience} years` : "Not set"}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Clinic:</span>
                <span className="text-gray-600">{vet.clinic || "Not set"}</span>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                Edit Profile
              </button>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full mt-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default VetProfile;