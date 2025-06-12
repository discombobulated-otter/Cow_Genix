import React from "react";
import { Bell, Thermometer, Calendar, Syringe, Stethoscope } from "lucide-react";

const AlertsPage = () => {
  const todayAlerts = [
    { name: "Vaccination", detail: "Due Today", icon: <Bell size={24} className="text-blue-500" /> },
    { name: "Heat Cycle Prediction", detail: "Due in 5 Days", icon: <Thermometer size={24} className="text-red-500" /> },
    { name: "Breeding Window", detail: "Due in 12 Days", icon: <Calendar size={24} className="text-green-500" /> },
  ];

  const upcomingAlerts = [
    { name: "Deworming", detail: "July 20, 2024", icon: <Syringe size={24} className="text-yellow-500" /> },
    { name: "Calf Checkup", detail: "August 5, 2024", icon: <Stethoscope size={24} className="text-purple-500" /> },
  ];

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center pb-6 border-b border-gray-300">
          <h2 className="text-3xl font-bold text-gray-800">Alerts</h2>
        </div>
        <AlertsSection title="Today" alerts={todayAlerts} />
        <AlertsSection title="Upcoming" alerts={upcomingAlerts} />
      </div>
    </div>
  );
};

const AlertsSection = ({ title, alerts }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-700 my-4">{title}</h3>
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className="flex items-center p-5 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-200 space-x-4 border border-gray-200"
        >
          <div className="p-3 bg-gray-100 rounded-full">{alert.icon}</div>
          <div>
            <p className="text-gray-900 font-semibold text-lg">{alert.name}</p>
            <p className="text-gray-500 text-sm">{alert.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AlertsPage;
