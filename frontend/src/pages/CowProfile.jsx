import React, { useState } from 'react';
import { Calendar, Scale, Heart, Syringe, Users, MapPin, Edit2, Save, X, AlertCircle, TrendingUp, Droplet, Activity } from 'lucide-react';

const CowProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [cowData, setCowData] = useState({
        tag: "#423",
        breed: "Gir",
        name: "Lakshmi",
        age: "3 years",
        gender: "Female",
        vaccinated: "2 months ago",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/2396/2396640.png",
        location: "Farm A, Block 3",
        healthHistory: {
            dateOfBirth: "2021-01-15",
            lastCheckup: "2024-03-22",
            weight: "350 kg",
            height: "140 cm",
            temperature: "38.5°C",
            heartRate: "60 bpm",
            respiratoryRate: "20 breaths/min"
        },
        vaccinations: [
            { name: "Foot and Mouth Disease", date: "2023-12-10", nextDue: "2024-12-10" },
            { name: "Blackleg", date: "2023-12-10", nextDue: "2024-12-10" },
            { name: "Haemorrhagic Septicaemia", date: "2023-12-10", nextDue: "2024-12-10" }
        ],
        breedingHistory: {
            lastBreeding: "2023-11-15",
            pregnancyStatus: "Not Pregnant",
            expectedCalving: null,
            breedingCount: 2
        },
        milkProduction: {
            dailyAverage: "12 liters",
            lastMilking: "2024-03-22",
            quality: "Grade A",
            fatContent: "4.2%"
        },
        diet: {
            feedType: "Mixed",
            dailyIntake: "25 kg",
            supplements: ["Mineral Mix", "Salt Lick"],
            lastFeedUpdate: "2024-03-20"
        },
        alerts: [
            { type: "warning", message: "Next vaccination due in 2 weeks" },
            { type: "info", message: "Weight check scheduled for next week" }
        ]
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, this would save to the backend
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <div className="absolute top-4 right-4">
                            {isEditing ? (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSave}
                                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                                    >
                                        <Save className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleEdit}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <div className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                            <img
                                src={cowData.imageUrl}
                                alt="Cow"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                            />
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900">{cowData.name}</h1>
                                <p className="text-xl text-gray-600">Tag {cowData.tag}</p>
                                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        {cowData.breed}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {cowData.gender}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                        {cowData.age}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts Section */}
                    {cowData.alerts.length > 0 && (
                        <div className="px-6 pb-4">
                            <div className="space-y-2">
                                {cowData.alerts.map((alert, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg flex items-center space-x-2 ${
                                            alert.type === 'warning'
                                                ? 'bg-yellow-50 text-yellow-800'
                                                : 'bg-blue-50 text-blue-800'
                                        }`}
                                    >
                                        <AlertCircle className="w-5 h-5" />
                                        <p>{alert.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <StatCard
                        icon={<Scale className="w-6 h-6" />}
                        title="Weight"
                        value={cowData.healthHistory.weight}
                    />
                    <StatCard
                        icon={<Activity className="w-6 h-6" />}
                        title="Temperature"
                        value={cowData.healthHistory.temperature}
                    />
                    <StatCard
                        icon={<Heart className="w-6 h-6" />}
                        title="Heart Rate"
                        value={cowData.healthHistory.heartRate}
                    />
                    <StatCard
                        icon={<Droplet className="w-6 h-6" />}
                        title="Milk Production"
                        value={cowData.milkProduction.dailyAverage}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Health History */}
                    <InfoCard
                        title="Health History"
                        icon={<Activity className="w-5 h-5" />}
                    >
                        <div className="space-y-3">
                            <InfoRow label="Date of Birth" value={cowData.healthHistory.dateOfBirth} />
                            <InfoRow label="Last Checkup" value={cowData.healthHistory.lastCheckup} />
                            <InfoRow label="Height" value={cowData.healthHistory.height} />
                            <InfoRow label="Respiratory Rate" value={cowData.healthHistory.respiratoryRate} />
                        </div>
                    </InfoCard>

                    {/* Vaccination Records */}
                    <InfoCard
                        title="Vaccination Records"
                        icon={<Syringe className="w-5 h-5" />}
                    >
                        <div className="space-y-3">
                            {cowData.vaccinations.map((vaccination, index) => (
                                <div key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                    <p className="font-medium text-gray-900">{vaccination.name}</p>
                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                        <span>Given: {vaccination.date}</span>
                                        <span>Next Due: {vaccination.nextDue}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                    {/* Breeding History */}
                    <InfoCard
                        title="Breeding History"
                        icon={<Users className="w-5 h-5" />}
                    >
                        <div className="space-y-3">
                            <InfoRow label="Last Breeding" value={cowData.breedingHistory.lastBreeding} />
                            <InfoRow label="Pregnancy Status" value={cowData.breedingHistory.pregnancyStatus} />
                            <InfoRow label="Breeding Count" value={cowData.breedingHistory.breedingCount} />
                            {cowData.breedingHistory.expectedCalving && (
                                <InfoRow label="Expected Calving" value={cowData.breedingHistory.expectedCalving} />
                            )}
                        </div>
                    </InfoCard>

                    {/* Diet Information */}
                    <InfoCard
                        title="Diet Information"
                        icon={<TrendingUp className="w-5 h-5" />}
                    >
                        <div className="space-y-3">
                            <InfoRow label="Feed Type" value={cowData.diet.feedType} />
                            <InfoRow label="Daily Intake" value={cowData.diet.dailyIntake} />
                            <InfoRow label="Last Update" value={cowData.diet.lastFeedUpdate} />
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Supplements</p>
                                <div className="flex flex-wrap gap-2">
                                    {cowData.diet.supplements.map((supplement, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                                        >
                                            {supplement}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

const InfoCard = ({ title, icon, children }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                {icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
    </div>
);

export default CowProfile;