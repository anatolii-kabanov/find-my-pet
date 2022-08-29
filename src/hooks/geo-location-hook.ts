import { useEffect, useState } from 'react';

function useGeoLocation() {
    const [position, setPosition] = useState<GeolocationCoordinates | undefined>()
    const [error, setError] = useState<string>();

    useEffect(() => {
        const geo = navigator.geolocation;
        if (!geo) {
          setError("Location data not available");
          return;
        }
        const watcher = geo.watchPosition((e) => { 
            setPosition(e.coords) 
        }, (e) => setError(e.message));
        return () => geo.clearWatch(watcher);
      }, [setPosition, setError]);


    return {
        position,
        error,
    };
}

export default useGeoLocation;
