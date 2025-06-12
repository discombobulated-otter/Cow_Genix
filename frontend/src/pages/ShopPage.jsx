import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { Search, Phone, Mail, MapPin, Clock, Star, Filter, ChevronDown, ChevronUp, CreditCard, Truck, Shield, Image as ImageIcon, Heart, BarChart2, Scale, Sliders } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const libraries = ['places'];

const ShopPage = () => {
    const { user, login, logout } = useAuth();
    const [selectedShop, setSelectedShop] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
    const [showDeliveryOnly, setShowDeliveryOnly] = useState(false);
    const [showOpenOnly, setShowOpenOnly] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [maxDistance, setMaxDistance] = useState(50);
    const [sortBy, setSortBy] = useState('rating');
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showComparisonModal, setShowComparisonModal] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [selectedShops, setSelectedShops] = useState([]);
    const [favoriteShops, setFavoriteShops] = useState([]);
    const [mapRadius, setMapRadius] = useState(50000);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: '',
        images: []
    });

    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'Veterinary', name: 'Veterinary' },
        { id: 'Pharmacy', name: 'Pharmacy' },
        { id: 'General', name: 'General' },
        { id: 'Equipment', name: 'Equipment' },
        { id: 'Feed', name: 'Feed' }
    ];

    const ratingOptions = [
        { id: 'all', name: 'All Ratings' },
        { id: '4', name: '4★ & Up' },
        { id: '3', name: '3★ & Up' },
        { id: '2', name: '2★ & Up' }
    ];

    const paymentMethods = [
        { id: 'all', name: 'All Payment Methods' },
        { id: 'Cash', name: 'Cash' },
        { id: 'Credit Card', name: 'Credit Card' },
        { id: 'Debit Card', name: 'Debit Card' },
        { id: 'UPI', name: 'UPI' },
        { id: 'Net Banking', name: 'Net Banking' }
    ];

    const sortOptions = [
        { id: 'rating', name: 'Rating' },
        { id: 'distance', name: 'Distance' },
        { id: 'price', name: 'Price' }
    ];

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const center = userLocation || {
        lat: 12.9716,
        lng: 77.5946
    };

    useEffect(() => {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }

        // Fetch shops
        fetchShops();
        // Fetch favorite shops if user is logged in
        if (user) {
            fetchFavoriteShops();
        }
    }, [user]);

    const fetchShops = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedRating) params.append('rating', selectedRating);
            if (searchTerm) params.append('search', searchTerm);
            if (showDeliveryOnly) params.append('delivery', 'true');
            if (selectedPaymentMethod) params.append('paymentMethod', selectedPaymentMethod);
            if (showOpenOnly) params.append('isOpen', 'true');
            if (priceRange) params.append('priceRange', `${priceRange[0]}-${priceRange[1]}`);
            if (maxDistance) params.append('distance', maxDistance);
            if (sortBy) params.append('sortBy', sortBy);
            
            if (userLocation) {
                params.append('lat', userLocation.lat);
                params.append('lng', userLocation.lng);
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/shops?${params}`);
            setShops(response.data);
        } catch (error) {
            console.error('Error fetching shops:', error);
            setError('Failed to fetch shops. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, selectedRating, searchTerm, showDeliveryOnly, selectedPaymentMethod, showOpenOnly, priceRange, maxDistance, sortBy, userLocation]);

    const fetchFavoriteShops = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shops/favorites`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFavoriteShops(response.data);
        } catch (err) {
            console.error('Error fetching favorite shops:', err);
        }
    };

    const toggleFavorite = async (shopId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/shops/${shopId}/favorite`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            fetchFavoriteShops();
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('rating', reviewForm.rating);
            formData.append('comment', reviewForm.comment);
            reviewForm.images.forEach(image => {
                formData.append('images', image);
            });

            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/shops/${selectedShop._id}/reviews`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            fetchShops();
            setShowReviewModal(false);
            setReviewForm({
                rating: 5,
                comment: '',
                images: []
            });
        } catch (err) {
            console.error('Error submitting review:', err);
            alert('Failed to submit review. Please try again.');
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setReviewForm(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const handleCompare = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/shops/compare`,
                { shopIds: selectedShops },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setShowComparisonModal(true);
            // Handle comparison data display
        } catch (err) {
            console.error('Error comparing shops:', err);
        }
    };

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        shops.forEach(shop => {
            bounds.extend(shop.location.coordinates);
        });
        map.fitBounds(bounds);
    }, [shops]);

    const filteredShops = shops;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Farm Supplies & Services</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                            {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {selectedShops.length > 1 && (
                            <button
                                onClick={handleCompare}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <Scale className="w-5 h-5" />
                                <span>Compare ({selectedShops.length})</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search shops by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <select
                                    value={selectedRating}
                                    onChange={(e) => setSelectedRating(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    {ratingOptions.map(option => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    value={selectedPaymentMethod}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    {paymentMethods.map(method => (
                                        <option key={method.id} value={method.id}>{method.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Min"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance (km)</label>
                                <input
                                    type="number"
                                    value={maxDistance}
                                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={showDeliveryOnly}
                                        onChange={(e) => setShowDeliveryOnly(e.target.checked)}
                                        className="rounded text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">Delivery Available</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={showOpenOnly}
                                        onChange={(e) => setShowOpenOnly(e.target.checked)}
                                        className="rounded text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">Open Now</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Map View */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={12}
                            onLoad={onLoad}
                        >
                            {userLocation && (
                                <Circle
                                    center={userLocation}
                                    radius={mapRadius}
                                    options={{
                                        fillColor: '#10B981',
                                        fillOpacity: 0.1,
                                        strokeColor: '#10B981',
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2
                                    }}
                                />
                            )}
                            {filteredShops.map(shop => (
                                <Marker
                                    key={shop._id}
                                    position={shop.location.coordinates}
                                    onClick={() => setSelectedShop(shop)}
                                />
                            ))}

                            {selectedShop && (
                                <InfoWindow
                                    position={selectedShop.location.coordinates}
                                    onCloseClick={() => setSelectedShop(null)}
                                >
                                    <div className="p-2">
                                        <h3 className="font-semibold text-gray-900">{selectedShop.name}</h3>
                                        <p className="text-sm text-gray-600">{selectedShop.address.street}</p>
                                        <div className="flex items-center mt-1">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span className="text-sm text-gray-600 ml-1">
                                                {selectedShop.rating.average.toFixed(1)} ({selectedShop.rating.count} reviews)
                                            </span>
                                        </div>
                                        <div className="mt-2 flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedShop(shop);
                                                    setShowReviewModal(true);
                                                }}
                                                className="text-sm text-green-600 hover:text-green-700"
                                            >
                                                Write Review
                                            </button>
                                            <button
                                                onClick={() => toggleFavorite(selectedShop._id)}
                                                className="text-sm text-gray-600 hover:text-gray-700"
                                            >
                                                {favoriteShops.includes(selectedShop._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                            </button>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    ) : (
                        <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                            <p className="text-gray-500">Loading map...</p>
                        </div>
                    )}
                </div>

                {/* Shop List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShops.map(shop => (
                        <div
                            key={shop._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{shop.name}</h3>
                                        <p className="text-sm text-gray-500">{shop.category}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => toggleFavorite(shop._id)}
                                            className={`p-1 rounded-full ${
                                                favoriteShops.includes(shop._id)
                                                    ? 'text-red-500 hover:text-red-600'
                                                    : 'text-gray-400 hover:text-gray-500'
                                            }`}
                                        >
                                            <Heart className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center">
                                            <Star className="w-5 h-5 text-yellow-400" />
                                            <span className="ml-1 text-gray-600">{shop.rating.average.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span>{shop.address.street}, {shop.address.city}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-5 h-5 mr-2" />
                                        <span>{shop.contact.phone}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-5 h-5 mr-2" />
                                        <span>{shop.contact.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-5 h-5 mr-2" />
                                        <span>{shop.availability[0]?.openTime} - {shop.availability[0]?.closeTime}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {shop.services.map((service, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {shop.deliveryOptions.available && (
                                            <div className="flex items-center text-gray-600">
                                                <Truck className="w-5 h-5 mr-2" />
                                                <span>Delivery</span>
                                            </div>
                                        )}
                                        {shop.paymentMethods.map((method, index) => (
                                            <div key={index} className="flex items-center text-gray-600">
                                                <CreditCard className="w-5 h-5 mr-2" />
                                                <span>{method}</span>
                                            </div>
                                        ))}
                                        {shop.isVerified && (
                                            <div className="flex items-center text-green-600">
                                                <Shield className="w-5 h-5 mr-2" />
                                                <span>Verified</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="mt-4 text-gray-600 text-sm">{shop.description}</p>

                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => setSelectedShop(shop)}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                                    >
                                        View on Map
                                    </button>
                                    {user && (
                                        <button
                                            onClick={() => {
                                                setSelectedShop(shop);
                                                setShowReviewModal(true);
                                            }}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            Write Review
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (selectedShops.includes(shop._id)) {
                                                setSelectedShops(selectedShops.filter(id => id !== shop._id));
                                            } else {
                                                setSelectedShops([...selectedShops, shop._id]);
                                            }
                                        }}
                                        className={`p-2 rounded-md ${
                                            selectedShops.includes(shop._id)
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <Scale className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${
                                                    star <= reviewForm.rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                                <div className="flex items-center space-x-2">
                                    <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
                                        <ImageIcon className="w-5 h-5" />
                                        <span>Add Images</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <span className="text-sm text-gray-500">
                                        {reviewForm.images.length} images selected
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Comparison Modal */}
            {showComparisonModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
                        <h2 className="text-xl font-semibold mb-4">Compare Shops</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {selectedShops.map(shopId => {
                                const shop = shops.find(s => s._id === shopId);
                                return (
                                    <div key={shopId} className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">{shop.name}</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span className="ml-1">{shop.rating.average.toFixed(1)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{shop.category}</p>
                                            <div className="text-sm">
                                                <p>Services: {shop.services.length}</p>
                                                <p>Features: {shop.features.length}</p>
                                                <p>Payment Methods: {shop.paymentMethods.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowComparisonModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Modal */}
            {showAnalyticsModal && selectedShop && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4">Shop Analytics</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Views</span>
                                <span className="font-semibold">{selectedShop.analytics.views}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Favorites</span>
                                <span className="font-semibold">{selectedShop.analytics.favorites}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Reviews</span>
                                <span className="font-semibold">{selectedShop.analytics.reviews}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Average Rating</span>
                                <span className="font-semibold">{selectedShop.analytics.averageRating.toFixed(1)}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowAnalyticsModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopPage;