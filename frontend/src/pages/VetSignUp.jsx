import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VetSignUp = ({url}) => {
  const [vetData, setVetData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    clinic: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setVetData({ ...vetData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/auth/vet/signup`, vetData,{withCredentials:true});
      console.log("Vet Signup successful:", res.data);
      navigate("/vet/dashboard");
    } catch (error) {
      console.error("Vet Signup error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-96 p-6 shadow-lg bg-gray-800 text-white rounded-2xl">
          <div className="text-center text-2xl font-semibold mb-4">
            Vet Registration
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={vetData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={vetData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              required
              value={vetData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              required
              value={vetData.specialization}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              name="experience"
              placeholder="Years of Experience"
              required
              value={vetData.experience}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              name="clinic"
              placeholder="Clinic Name"
              required
              value={vetData.clinic}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={vetData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition"
            >
              Sign Up as Vet
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">or</p>
            <button
              className="w-full mt-2 flex items-center justify-center gap-2 p-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
              onClick={() =>
                (window.location.href = "http://localhost:5000/auth/vet/google")
              }
            >
              <FcGoogle size={20} /> Sign Up with Google
            </button>
            <button
              onClick={() => navigate("/vet/login")}
              className="text-sm text-blue-500"
            >
              Already have an account? LOGIN
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VetSignUp;
