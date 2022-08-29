import { Marker, Popup, useMap } from 'react-leaflet';
import useGeoLocation from '../../hooks/geo-location-hook';
import useUserDefaultLocation from '../../hooks/user-default-location-hook';
import { useEffect } from 'react';
import { getPets } from '../../local-storage/store';

export const LeafletMap: React.FC = () => { 
    const { position, error } = useGeoLocation();
    const { userLocation } = useUserDefaultLocation(position);
    const map = useMap();

    const pets = getPets();

    useEffect(() => {
        map.setView(userLocation);
    }, [userLocation]);

    return <div>
        <Marker position={userLocation}>
        </Marker>
        {pets.map((p) => <Marker position={p.coordinates} >
            <Popup>
                <img src={p.avatar} className="pet-popup-img"/>
                <div>Name: <h4>{p.name}</h4></div>
                <p>{p.description}</p>
            </Popup>
        </Marker>)}
    </div>;
}