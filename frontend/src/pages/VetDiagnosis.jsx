import React, { useState, useEffect } from 'react';
import { Search, Tag, Calendar, Scale, Heart, Activity, Droplet, AlertCircle, Save, X, Upload, Camera } from 'lucide-react';

const VetDiagnosis = () => {
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCow, setSelectedCow] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Basic Information
        tagId: '',
        checkupDate: new Date().toISOString().split('T')[0],
        checkupType: 'routine', // routine, emergency, follow-up
        reason: '',

        // Vital Signs
        temperature: '',
        heartRate: '',
        respiratoryRate: '',
        weight: '',
        bodyConditionScore: '', // 1-5 scale

        // Physical Examination
        generalAppearance: '',
        skinCondition: '',
        coatCondition: '',
        eyes: '',
        nose: '',
        mouth: '',
        udder: '',
        hooves: '',
        gait: '',

        // Health Assessment
        appetite: 'normal', // poor, normal, good
        waterIntake: 'normal', // reduced, normal, increased
        rumination: 'normal', // poor, normal, good
        defecation: 'normal', // abnormal, normal
        urination: 'normal', // abnormal, normal
        milkProduction: '', // liters per day
        milkQuality: 'normal', // poor, normal, good

        // Reproductive Status
        reproductiveStatus: 'normal', // normal, pregnant, postpartum, dry
        pregnancyStage: '', // if pregnant
        lastCalving: '', // if applicable
        breedingHistory: '',

        // Vaccination Status
        vaccinations: [],
        nextVaccinationDue: '',

        // Treatment
        diagnosis: '',
        treatment: '',
        medications: [],
        followUpDate: '',

        // Notes
        notes: '',
        recommendations: '',

        // Images
        images: []
    });

    useEffect(() => {
        try {
            // Add any initialization logic here
            console.log('VetDiagnosis component mounted');
        } catch (err) {
            console.error('Error in VetDiagnosis:', err);
            setError(err.message);
        }
    }, []);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-red-800 font-semibold">Error</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayInputChange = (e, field) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [field]: value.split(',').map(item => item.trim())
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        // In a real app, you would upload these to a server
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // In a real app, this would make an API call to save the diagnosis
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Diagnosis saved successfully!');
            // Reset form or redirect
        } catch (error) {
            console.error('Error saving diagnosis:', error);
            alert('Error saving diagnosis. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Veterinary Diagnosis</h1>

                {/* Cow Search */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search cow by tag ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Diagnosis Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tag ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="tagId"
                                        value={formData.tagId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Checkup Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="checkupDate"
                                        value={formData.checkupDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Checkup Type
                                </label>
                                <select
                                    name="checkupType"
                                    value={formData.checkupType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="routine">Routine Checkup</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="follow-up">Follow-up</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Visit
                                </label>
                                <input
                                    type="text"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vital Signs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Temperature (°C)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="temperature"
                                        value={formData.temperature}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <Activity className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Heart Rate (bpm)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="heartRate"
                                        value={formData.heartRate}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <Heart className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Weight (kg)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <Scale className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Physical Examination */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Physical Examination</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    General Appearance
                                </label>
                                <textarea
                                    name="generalAppearance"
                                    value={formData.generalAppearance}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Skin Condition
                                </label>
                                <textarea
                                    name="skinCondition"
                                    value={formData.skinCondition}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Udder Condition
                                </label>
                                <textarea
                                    name="udder"
                                    value={formData.udder}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hooves
                                </label>
                                <textarea
                                    name="hooves"
                                    value={formData.hooves}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Health Assessment */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Assessment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Appetite
                                </label>
                                <select
                                    name="appetite"
                                    value={formData.appetite}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="poor">Poor</option>
                                    <option value="normal">Normal</option>
                                    <option value="good">Good</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Milk Production (liters/day)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="milkProduction"
                                        value={formData.milkProduction}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <Droplet className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Treatment */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Diagnosis
                                </label>
                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Treatment
                                </label>
                                <textarea
                                    name="treatment"
                                    value={formData.treatment}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Medications (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.medications.join(', ')}
                                    onChange={(e) => handleArrayInputChange(e, 'medications')}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Follow-up Date
                                </label>
                                <input
                                    type="date"
                                    name="followUpDate"
                                    value={formData.followUpDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Camera className="w-8 h-8 mb-2 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Upload ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setFormData({
                                ...formData,
                                tagId: '',
                                checkupDate: new Date().toISOString().split('T')[0],
                                reason: '',
                                temperature: '',
                                heartRate: '',
                                weight: '',
                                generalAppearance: '',
                                skinCondition: '',
                                udder: '',
                                hooves: '',
                                appetite: 'normal',
                                milkProduction: '',
                                diagnosis: '',
                                treatment: '',
                                medications: [],
                                followUpDate: '',
                                images: []
                            })}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Diagnosis
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VetDiagnosis; 