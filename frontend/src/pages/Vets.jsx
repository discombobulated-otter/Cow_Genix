import React, { useEffect, useState } from 'react';
import axios from "axios";
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  Filter,
  Award,
  Calendar,
  Map,
  List,
  SortAsc,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import VetMap from '../components/VetMap';
import AppointmentBooking from '../components/AppointmentBooking';

const Vets = ({url}) => {
    const [vets, setVets] = useState([]);
    const [filteredVets, setFilteredVets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [selectedExperience, setSelectedExperience] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedRating, setSelectedRating] = useState('all');
    const [selectedAvailability, setSelectedAvailability] = useState('all');
    const [showReviews, setShowReviews] = useState({});
    const [selectedVet, setSelectedVet] = useState(null);
    const [showBooking, setShowBooking] = useState(false);

    const specialties = [
        'all',
        'General Practice',
        'Surgery',
        'Reproduction',
        'Nutrition',
        'Emergency Care',
        'Preventive Medicine',
        'Dermatology',
        'Internal Medicine',
        'Orthopedics'
    ];

    const experienceRanges = [
        { value: 'all', label: 'All Experience' },
        { value: '0-5', label: '0-5 years' },
        { value: '5-10', label: '5-10 years' },
        { value: '10+', label: '10+ years' }
    ];

    const ratingOptions = [
        { value: 'all', label: 'All Ratings' },
        { value: '4+', label: '4+ Stars' },
        { value: '3+', label: '3+ Stars' },
        { value: '2+', label: '2+ Stars' }
    ];

    const availabilityOptions = [
        { value: 'all', label: 'All Availability' },
        { value: 'today', label: 'Available Today' },
        { value: 'week', label: 'Available This Week' },
        { value: 'emergency', label: 'Emergency Services' }
    ];

    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'experience', label: 'Experience' },
        { value: 'rating', label: 'Rating' },
        { value: 'distance', label: 'Distance' }
    ];

    // Mock reviews data (replace with actual API data)
    const mockReviews = {
        '1': [
            { id: 1, rating: 5, comment: "Excellent service! Very knowledgeable and caring.", author: "John D.", date: "2024-03-15" },
            { id: 2, rating: 4, comment: "Great experience overall.", author: "Sarah M.", date: "2024-03-10" }
        ],
        '2': [
            { id: 1, rating: 5, comment: "Best vet in the area!", author: "Mike R.", date: "2024-03-12" }
        ]
    };

    useEffect(() => {
        const fetchVets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/vets');
                // If the API call is successful but returns no data, use mock data
                const vetsData = response.data.length > 0 ? response.data : mockVets;
                const vetsWithMockData = vetsData.map(vet => ({
                    ...vet,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviewCount: Math.floor(Math.random() * 100),
                    latitude: (Math.random() * 10 + 20).toFixed(6),
                    longitude: (Math.random() * 10 + 78).toFixed(6),
                    isAvailable: Math.random() > 0.3
                }));
                setVets(vetsWithMockData);
                setFilteredVets(vetsWithMockData);
            } catch (error) {
                console.error('Error fetching vets:', error);
                // If the API call fails, use mock data
                const vetsWithMockData = mockVets.map(vet => ({
                    ...vet,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviewCount: Math.floor(Math.random() * 100),
                    latitude: (Math.random() * 10 + 20).toFixed(6),
                    longitude: (Math.random() * 10 + 78).toFixed(6),
                    isAvailable: Math.random() > 0.3
                }));
                setVets(vetsWithMockData);
                setFilteredVets(vetsWithMockData);
            }
        };

        fetchVets();
    }, []);

    // Add mock data for testing
    const mockVets = [
        {
            _id: '1',
            name: 'Dr. Sarah Johnson',
            specialization: 'General Practice',
            experience: 8,
            location: 'Mumbai, Maharashtra',
            phone: '+91 9876543210',
            email: 'sarah.johnson@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random'
        },
        {
            _id: '2',
            name: 'Dr. Rajesh Patel',
            specialization: 'Surgery',
            experience: 12,
            location: 'Delhi, NCR',
            phone: '+91 9876543211',
            email: 'rajesh.patel@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Rajesh+Patel&background=random'
        },
        {
            _id: '3',
            name: 'Dr. Priya Sharma',
            specialization: 'Dermatology',
            experience: 6,
            location: 'Bangalore, Karnataka',
            phone: '+91 9876543212',
            email: 'priya.sharma@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=random'
        },
        {
            _id: '4',
            name: 'Dr. Amit Kumar',
            specialization: 'Cardiology',
            experience: 15,
            location: 'Chennai, Tamil Nadu',
            phone: '+91 9876543213',
            email: 'amit.kumar@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=random'
        },
        {
            _id: '5',
            name: 'Dr. Neha Gupta',
            specialization: 'Neurology',
            experience: 10,
            location: 'Hyderabad, Telangana',
            phone: '+91 9876543214',
            email: 'neha.gupta@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=random'
        },
        {
            _id: '6',
            name: 'Dr. Vikram Singh',
            specialization: 'Orthopedics',
            experience: 9,
            location: 'Pune, Maharashtra',
            phone: '+91 9876543215',
            email: 'vikram.singh@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=random'
        }
    ];

    useEffect(() => {
        let result = vets;

        // Filter by search term
        if (searchTerm) {
            result = result.filter(vet => 
                vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vet.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vet.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by specialty
        if (selectedSpecialty !== 'all') {
            result = result.filter(vet => 
                vet.specialization.toLowerCase() === selectedSpecialty.toLowerCase()
            );
        }

        // Filter by experience
        if (selectedExperience !== 'all') {
            const [min, max] = selectedExperience.split('-').map(Number);
            result = result.filter(vet => {
                const exp = parseInt(vet.experience);
                if (max) {
                    return exp >= min && exp < max;
                } else {
                    return exp >= min;
                }
            });
        }

        // Filter by rating
        if (selectedRating !== 'all') {
            const minRating = parseInt(selectedRating);
            result = result.filter(vet => parseFloat(vet.rating) >= minRating);
        }

        // Filter by availability
        if (selectedAvailability !== 'all') {
            result = result.filter(vet => {
                switch (selectedAvailability) {
                    case 'today':
                        return vet.availability?.includes('Today');
                    case 'week':
                        return vet.availability?.includes('This Week');
                    case 'emergency':
                        return vet.availability?.includes('24/7');
                    default:
                        return true;
                }
            });
        }

        // Sort results
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'experience':
                    comparison = a.experience - b.experience;
                    break;
                case 'rating':
                    comparison = parseFloat(b.rating) - parseFloat(a.rating);
                    break;
                case 'distance':
                    comparison = parseFloat(a.distance) - parseFloat(b.distance);
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredVets(result);
    }, [searchTerm, selectedSpecialty, selectedExperience, selectedRating, selectedAvailability, sortBy, sortOrder, vets]);

    const toggleReviews = (vetId) => {
        setShowReviews(prev => ({
            ...prev,
            [vetId]: !prev[vetId]
        }));
    };

    const handleVetSelect = (vet) => {
        setSelectedVet(vet);
        setShowBooking(true);
    };

    const handleBookAppointment = (appointment) => {
        console.log('Booking appointment:', appointment);
        setShowBooking(false);
        // In a real app, this would make an API call to save the appointment
    };

    const VetCard = ({ vet }) => (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl font-semibold text-green-600">
                            {vet.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{vet.name}</h2>
                        <p className="text-sm text-gray-500">{vet.specialization}</p>
                        <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">{vet.rating} ({vet.reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                        <Award className="w-4 h-4 mr-2 text-green-600" />
                        <span>{vet.experience} years of experience</span>
                    </div>
                    {vet.location && (
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-green-600" />
                            <span>{vet.location} ({vet.distance} km away)</span>
                        </div>
                    )}
                    {vet.phone && (
                        <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-green-600" />
                            <span>{vet.phone}</span>
                        </div>
                    )}
                    {vet.email && (
                        <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2 text-green-600" />
                            <span>{vet.email}</span>
                        </div>
                    )}
                    {vet.availability && (
                        <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-green-600" />
                            <span>{vet.availability}</span>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleReviews(vet._id)}
                        className="flex items-center text-sm text-green-600 hover:text-green-700"
                    >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {showReviews[vet._id] ? 'Hide Reviews' : 'Show Reviews'}
                        {showReviews[vet._id] ? (
                            <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                            <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                    </button>
                    
                    {showReviews[vet._id] && mockReviews[vet._id] && (
                        <div className="mt-2 space-y-3">
                            {mockReviews[vet._id].map(review => (
                                <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-sm font-medium">{review.rating}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{review.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{review.comment}</p>
                                    <p className="text-xs text-gray-500 mt-1">- {review.author}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex space-x-2">
                    <NavLink 
                        to={`/vet/${vet._id}`} 
                        className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        View Profile
                    </NavLink>
                    <a 
                        href={`tel:${vet.phone}`}
                        className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                    >
                        <Phone className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center pb-6 border-b border-gray-300">
                    <h1 className="text-3xl font-bold text-gray-800">Our Veterinarians</h1>
                </div>

                {/* Search and Filter Section */}
                <div className="my-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, specialty, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === 'map' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Map className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Specialty
                                    </label>
                                    <select
                                        value={selectedSpecialty}
                                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    >
                                        {specialties.map((specialty) => (
                                            <option key={specialty} value={specialty}>
                                                {specialty === 'all' ? 'All Specialties' : specialty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Experience
                                    </label>
                                    <select
                                        value={selectedExperience}
                                        onChange={(e) => setSelectedExperience(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    >
                                        {experienceRanges.map((range) => (
                                            <option key={range.value} value={range.value}>
                                                {range.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rating
                                    </label>
                                    <select
                                        value={selectedRating}
                                        onChange={(e) => setSelectedRating(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    >
                                        {ratingOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Availability
                                    </label>
                                    <select
                                        value={selectedAvailability}
                                        onChange={(e) => setSelectedAvailability(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    >
                                        {availabilityOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort By
                                    </label>
                                    <div className="flex space-x-2">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        >
                                            {sortOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <SortAsc className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-gray-600">
                        Found {filteredVets.length} veterinarian{filteredVets.length !== 1 ? 's' : ''}
                    </p>
                    {viewMode === 'map' && (
                        <div className="text-sm text-gray-500">
                            Map view coming soon...
                        </div>
                    )}
                </div>

                {/* Vets Grid/Map */}
                {viewMode === 'grid' ? (
                    filteredVets.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredVets.map((vet) => (
                                <VetCard key={vet._id} vet={vet} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-lg">No veterinarians found matching your criteria.</p>
                        </div>
                    )
                ) : (
                    <VetMap vets={filteredVets} onVetSelect={handleVetSelect} />
                )}
            </div>

            {showBooking && selectedVet && (
                <AppointmentBooking
                    vet={selectedVet}
                    onClose={() => setShowBooking(false)}
                    onBook={handleBookAppointment}
                />
            )}
        </div>
    );
}

export default Vets;