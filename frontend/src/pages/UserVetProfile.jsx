import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

const UserVetProfile = ({url}) => {
    const [vet, setVet] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchVet = async () => {
            try {
                const response = await axios(`${url}/auth/user/vet/${id}`, { withCredentials: true });
                if (response.data.success) {
                    setVet(response.data.vet);
                }
            } catch (err) {
                console.error("Failed to fetch vet profile:", err);
            }
        };
        fetchVet();
    }, [id]);

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 p-6">
                    {vet ? (
                        <div className="space-y-6">
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-2xl font-semibold text-indigo-600">
                                        {vet.name?.charAt(0) || "V"}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-indigo-600">Dr. {vet.name}</h2>
                            </div>

                            <div className="grid gap-4">
                                <div className="flex items-center">
                                    <span className="w-32 font-medium text-gray-700">Specialization:</span>
                                    <span className="text-gray-600">{vet.specialization || "Not specified"}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-32 font-medium text-gray-700">Experience:</span>
                                    <span className="text-gray-600">{vet.experience ? `${vet.experience} years` : "Not specified"}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-32 font-medium text-gray-700">Phone:</span>
                                    <span className="text-gray-600">{vet.phone || "Not specified"}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-32 font-medium text-gray-700">Clinic:</span>
                                    <span className="text-gray-600">{vet.clinic || "Not specified"}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-32 font-medium text-gray-700">Email:</span>
                                    <span className="text-gray-600">{vet.email || "Not specified"}</span>
                                </div>
                            </div>

                            <button 
                                className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium mt-6"
                            >
                                Get Appointment
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Loading veterinarian profile...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserVetProfile;