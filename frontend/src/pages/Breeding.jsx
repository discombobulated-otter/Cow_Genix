// src/pages/Breeding.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Calendar, Tag, Users, ChevronRight, Loader2 } from 'lucide-react';
import BreedingTree from '../components/BreedingTree';
import { useGeolocation } from '../hooks/useGeolocation';

const Breeding = () => {
    const [formData, setFormData] = useState({
        tagId: '',
        location: '',
        inheritanceAge: '',
        parentTagId1: '',
        parentTagId2: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [cowDetails, setCowDetails] = useState(null);
    const [showTree, setShowTree] = useState(false);
    const { location: geoLocation, error: geoError } = useGeolocation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUseCurrentLocation = () => {
        if (geoLocation) {
            setFormData(prev => ({
                ...prev,
                location: `${geoLocation.latitude}, ${geoLocation.longitude}`
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuggestions([]);
        setCowDetails(null);

        try {
            // First, fetch cow details
            const cowResponse = await axios.get(`http://localhost:5000/api/cows/${formData.tagId}`);
            setCowDetails(cowResponse.data);

            // Then, get breeding suggestions
            const suggestionsResponse = await axios.post('http://localhost:5000/api/predict-mate', {
                tagId: formData.tagId,
                location: formData.location,
                inheritanceAge: formData.inheritanceAge,
                parentTagId1: formData.parentTagId1,
                parentTagId2: formData.parentTagId2
            });

            setSuggestions(suggestionsResponse.data.suggestions);
            setShowTree(true);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching suggestions');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestBreeding = async (suggestedMate) => {
        try {
            await axios.post('http://localhost:5000/api/breeding-requests', {
                cowTagId: formData.tagId,
                mateTagId: suggestedMate.tagId,
                location: formData.location
            });
            alert('Breeding request submitted successfully!');
        } catch (err) {
            setError('Failed to submit breeding request');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Breeding Suggestions</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cow Tag ID
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="tagId"
                                    value={formData.tagId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter cow's tag ID"
                                />
                                <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter location or use current location"
                                />
                                <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    className="absolute right-3 top-2.5 text-sm text-green-600 hover:text-green-700"
                                >
                                    Use Current
                                </button>
                            </div>
                            {geoError && (
                                <p className="mt-1 text-sm text-red-600">
                                    Error accessing location: {geoError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Inheritance Age (months)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="inheritanceAge"
                                    value={formData.inheritanceAge}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter inheritance age"
                                />
                                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Parent Tag IDs (Optional)
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="parentTagId1"
                                        value={formData.parentTagId1}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Parent 1 Tag ID"
                                    />
                                    <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="parentTagId2"
                                        value={formData.parentTagId2}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Parent 2 Tag ID"
                                    />
                                    <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Finding Matches...
                                </>
                            ) : (
                                'Find Breeding Matches'
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {suggestions.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Suggested Matches
                            </h2>
                            <div className="space-y-4">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={suggestion.tagId}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Tag ID: {suggestion.tagId}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Location: {suggestion.location}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRequestBreeding(suggestion)}
                                                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
                                            >
                                                Request Match
                                            </button>
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Genetic Diversity</p>
                                                <p className="font-medium text-gray-900">
                                                    {suggestion.geneticDiversity}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Compatibility</p>
                                                <p className="font-medium text-gray-900">
                                                    {suggestion.compatibility}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {showTree && cowDetails && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Breeding Tree
                            </h2>
                            <BreedingTree
                                currentCow={cowDetails}
                                suggestions={suggestions}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Breeding;
