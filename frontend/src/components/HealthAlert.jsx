// src/components/HealthAlert.js
import React from "react";

const HealthAlert = ({ name, id, issue }) => {
  return (
    <div className="p-4 border-b">
      <h2 className="font-bold">{name} #{id}</h2>
      <p className="text-green-600">{issue}</p>
    </div>
  );
};

export default HealthAlert;
