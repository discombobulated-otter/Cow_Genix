import React from "react";

const BreedingConsultation = ({ cow, farmer }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm mt-2">
      <p className="font-medium">{cow} - Breeding Consultation</p>
      <p className="text-sm text-gray-600">Requested by {farmer}</p>
    </div>
  );
};

export default BreedingConsultation;
