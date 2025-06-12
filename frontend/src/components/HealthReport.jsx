import React from "react";

const HealthReport = ({ cow, issue }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm mt-2">
      <p className="font-medium">{cow}</p>
      <p className="text-sm text-red-600">Issue: {issue}</p>
    </div>
  );
};

export default HealthReport;
