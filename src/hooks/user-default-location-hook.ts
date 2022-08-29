import { useEffect, useState } from 'react';
import { Coordinates } from '../models';

function useUserDefaultLocation(postion?: GeolocationCoordinates) {
    const [userLocation, setUserLocation] = useState<Coordinates>({ lat: postion?.latitude ?? -70.9, lng: postion?.longitude ?? 42.35 });

    useEffect(() => {
        if (postion) {
            setUserLocation({ lat: postion.latitude, lng: postion.longitude })
        }
    }, [postion]);


    return {
        userLocation,
    };
}

export default useUserDefaultLocation;