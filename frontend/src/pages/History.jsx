// src/pages/History.js
import React, { useState } from "react";
import { 
  Calendar, 
  Activity, 
  Heart, 
  Syringe, 
  Stethoscope,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const History = () => {
  const [expandedSections, setExpandedSections] = useState({
    "Health History": true,
    "Breeding History": true,
    "Vaccination Records": true,
    "Medical Treatments": true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const healthHistory = [
    {
      date: "2024-03-15",
      type: "Check-up",
      description: "Regular health check-up",
      status: "Completed",
      vet: "Dr. Smith"
    },
    {
      date: "2024-02-28",
      type: "Emergency",
      description: "Treatment for fever",
      status: "Completed",
      vet: "Dr. Johnson"
    },
    {
      date: "2024-02-15",
      type: "Check-up",
      description: "Post-calving check",
      status: "Completed",
      vet: "Dr. Smith"
    }
  ];

  const breedingHistory = [
    {
      date: "2024-03-10",
      type: "Breeding",
      description: "Artificial insemination",
      status: "In Progress",
      bull: "Breeder A"
    },
    {
      date: "2024-01-20",
      type: "Calving",
      description: "Successful delivery",
      status: "Completed",
      calf: "Calf ID: C123"
    },
    {
      date: "2023-12-15",
      type: "Breeding",
      description: "Natural breeding",
      status: "Completed",
      bull: "Breeder B"
    }
  ];

  const vaccinationRecords = [
    {
      date: "2024-03-01",
      vaccine: "BVD",
      dose: "1st",
      nextDue: "2024-09-01",
      administeredBy: "Dr. Smith"
    },
    {
      date: "2024-02-15",
      vaccine: "IBR",
      dose: "2nd",
      nextDue: "2024-08-15",
      administeredBy: "Dr. Johnson"
    },
    {
      date: "2024-01-30",
      vaccine: "Leptospirosis",
      dose: "Annual",
      nextDue: "2025-01-30",
      administeredBy: "Dr. Smith"
    }
  ];

  const medicalTreatments = [
    {
      date: "2024-03-10",
      treatment: "Antibiotics",
      condition: "Mastitis",
      duration: "5 days",
      prescribedBy: "Dr. Smith"
    },
    {
      date: "2024-02-20",
      treatment: "Anti-inflammatory",
      condition: "Joint pain",
      duration: "3 days",
      prescribedBy: "Dr. Johnson"
    },
    {
      date: "2024-01-15",
      treatment: "Vitamins",
      condition: "Nutritional supplement",
      duration: "30 days",
      prescribedBy: "Dr. Smith"
    }
  ];

  const HistorySection = ({ title, icon: Icon, data, renderItem, expanded }) => (
    <div className="mb-6">
      <button
        onClick={() => toggleSection(title)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {expanded && (
        <div className="mt-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center pb-6 border-b border-gray-300">
          <h1 className="text-3xl font-bold text-gray-800">History</h1>
        </div>

        <div className="mt-6 space-y-4">
          <HistorySection
            title="Health History"
            icon={Activity}
            data={healthHistory}
            expanded={expandedSections["Health History"]}
            renderItem={(item) => (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="text-sm text-gray-500">Vet: {item.vet}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{item.date}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    item.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            )}
          />

          <HistorySection
            title="Breeding History"
            icon={Heart}
            data={breedingHistory}
            expanded={expandedSections["Breeding History"]}
            renderItem={(item) => (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  {item.bull && <p className="text-sm text-gray-500">Bull: {item.bull}</p>}
                  {item.calf && <p className="text-sm text-gray-500">{item.calf}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{item.date}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    item.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            )}
          />

          <HistorySection
            title="Vaccination Records"
            icon={Syringe}
            data={vaccinationRecords}
            expanded={expandedSections["Vaccination Records"]}
            renderItem={(item) => (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{item.vaccine}</p>
                  <p className="text-sm text-gray-500">Dose: {item.dose}</p>
                  <p className="text-sm text-gray-500">Administered by: {item.administeredBy}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date: {item.date}</p>
                  <p className="text-sm text-gray-500">Next due: {item.nextDue}</p>
                </div>
              </div>
            )}
          />

          <HistorySection
            title="Medical Treatments"
            icon={Stethoscope}
            data={medicalTreatments}
            expanded={expandedSections["Medical Treatments"]}
            renderItem={(item) => (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{item.treatment}</p>
                  <p className="text-sm text-gray-500">Condition: {item.condition}</p>
                  <p className="text-sm text-gray-500">Prescribed by: {item.prescribedBy}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date: {item.date}</p>
                  <p className="text-sm text-gray-500">Duration: {item.duration}</p>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default History;
