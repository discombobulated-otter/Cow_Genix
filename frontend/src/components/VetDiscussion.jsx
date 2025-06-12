// src/components/VetDiscussion.js
import React from "react";

const VetDiscussion = ({ doctor, schedule }) => {
  return (
    <div className="p-4">
      <h2 className="font-bold">{doctor}</h2>
      <p className="text-green-600">{schedule}</p>
    </div>
  );
};

export default VetDiscussion;
