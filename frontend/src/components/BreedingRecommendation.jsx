// src/components/BreedingRecommendation.js
import React from "react";

const BreedingRecommendation = ({ name, id, recommendation }) => {
  return (
    <div className="p-4 border-b">
      <h2 className="font-bold">{name} #{id}</h2>
      <p className="text-green-600">{recommendation}</p>
    </div>
  );
};

export default BreedingRecommendation;
