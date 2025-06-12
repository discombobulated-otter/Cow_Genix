import React from "react";
import AppointmentCard from "../components/AppointmentCard";
import HealthReport from "../components/HealthReport";
import BreedingConsultation from "../components/BreedingConsultation";

const VitDashboard = () => {
  // Static Data for Vet Dashboard
  const appointments = [
    { id: "1", farmer: "Ramesh Kumar", date: "March 25, 2024" },
    { id: "2", farmer: "Sita Verma", date: "March 27, 2024" },
  ];

  const healthReports = [
    { id: "1", cow: "Laxmi", issue: "B12 Deficiency" },
    { id: "2", cow: "Radha", issue: "Calcium Deficiency" },
  ];

  const breedingRequests = [
    { id: "1", cow: "Kamadhenu", farmer: "Mahesh Yadav" },
    { id: "2", cow: "Gauri", farmer: "Shyam Singh" },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Vet Dashboard</h1>

        <div className="grid gap-6">
          {/* Upcoming Appointments */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} farmer={appointment.farmer} date={appointment.date} />
              ))}
            </div>
          </section>

          {/* Cow Health Reports */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cow Health Reports</h2>
            <div className="space-y-4">
              {healthReports.map((report) => (
                <HealthReport key={report.id} cow={report.cow} issue={report.issue} />
              ))}
            </div>
          </section>

          {/* Breeding Consultation Requests */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Breeding Consultations</h2>
            <div className="space-y-4">
              {breedingRequests.map((request) => (
                <BreedingConsultation key={request.id} cow={request.cow} farmer={request.farmer} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VitDashboard;
