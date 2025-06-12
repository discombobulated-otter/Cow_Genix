import { useState, useEffect } from 'react';

export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        const successHandler = (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
            setError(null);
        };

        const errorHandler = (error) => {
            setError(error.message);
            setLocation(null);
        };

        navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    }, []);

    return { location, error };
}; 