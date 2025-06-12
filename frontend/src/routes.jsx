import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Breeding from "./pages/Breeding";
import History from "./pages/History";
import Profile from "./pages/Profile";
import CowProfile from "./pages/CowProfile";
import ShopPage from "./pages/ShopPage";
import AlertPage from "./pages/AlertPage";
import VitDashboard from "./pages/VitDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VetSignUp from "./pages/VetSignUp";
import VetLogin from "./pages/VetLogin";
import VetProfile from "./pages/VetProfile";
import Vets from "./pages/Vets";
import UserVetProfile from "./pages/UserVetProfile";
import VetAlert from "./pages/VetAlert";
import VetDiagnosis from "./pages/VetDiagnosis";
import Sidebar from "./components/Sidebar";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";

const ProtectedLayout = () => {
  const { isCollapsed } = useSidebar();
  const url = "https://cow-genix.onrender.com";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main 
        className={`transition-all duration-300 p-6 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Routes>
          <Route path="/vets" element={<Vets url={url} />} />
          <Route path="/vet/:id" element={<UserVetProfile url={url} />} />
          <Route path="/vet/dashboard" element={<VitDashboard />} />
          <Route path="/vet/profile" element={<VetProfile url={url} />} />
          <Route path="/vet/diagnosis" element={<VetDiagnosis />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/vit" element={<VitDashboard />} />
          <Route path="/breeding" element={<Breeding />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile url={url} />} />
          <Route path="/vet/alert" element={<VetAlert />} />
          <Route path="/cowprofile" element={<CowProfile />} />
          <Route path="/shopPage" element={<ShopPage />} />
          <Route path="/alertPage" element={<AlertPage />} />
        </Routes>
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const url = "https://cow-genix.onrender.com";
  
  return (
    <SidebarProvider>
      <Routes>
        {/* Public routes without sidebar */}
        <Route path="/" element={<SignUp url={url} />} />
        <Route path="/login" element={<Login url={url} />} />
        <Route path="/vet/login" element={<VetLogin url={url} />} />
        <Route path="/vet/signup" element={<VetSignUp url={url} />} />
        
        {/* Protected routes with sidebar */}
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </SidebarProvider>
  );
};

export default AppRoutes; 