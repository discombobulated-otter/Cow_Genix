import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '600px'
};

const center = {
    lat: 20.5937, // Default to India's center
    lng: 78.9629
};

const VetMap = ({ vets, onVetSelect }) => {
    const [selectedVet, setSelectedVet] = useState(null);
    const [map, setMap] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    const handleMarkerClick = (vet) => {
        setSelectedVet(vet);
        if (onVetSelect) {
            onVetSelect(vet);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={5}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ]
                }}
            >
                {vets.map((vet) => (
                    <Marker
                        key={vet._id}
                        position={{
                            lat: parseFloat(vet.latitude) || center.lat,
                            lng: parseFloat(vet.longitude) || center.lng
                        }}
                        onClick={() => handleMarkerClick(vet)}
                        icon={{
                            url: '/vet-marker.png',
                            scaledSize: new window.google.maps.Size(40, 40)
                        }}
                    />
                ))}

                {selectedVet && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedVet.latitude) || center.lat,
                            lng: parseFloat(selectedVet.longitude) || center.lng
                        }}
                        onCloseClick={() => setSelectedVet(null)}
                    >
                        <div className="p-2 max-w-xs">
                            <h3 className="font-semibold text-gray-900">{selectedVet.name}</h3>
                            <p className="text-sm text-gray-600">{selectedVet.specialization}</p>
                            <div className="mt-2 flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-600">
                                    {selectedVet.rating} ({selectedVet.reviewCount} reviews)
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{selectedVet.location}</p>
                            <button
                                onClick={() => onVetSelect(selectedVet)}
                                className="mt-2 w-full bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                                View Profile
                            </button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default VetMap; 