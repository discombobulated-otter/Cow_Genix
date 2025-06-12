import React from "react";

const AppointmentCard = ({ farmer, date }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm mt-2">
      <p className="font-medium">Appointment with {farmer}</p>
      <p className="text-sm text-gray-600">Date: {date}</p>
    </div>
  );
};

export default AppointmentCard;
