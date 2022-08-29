import './leaflet-container.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import useGeoLocation from '../../hooks/geo-location-hook';
import useUserDefaultLocation from '../../hooks/user-default-location-hook';
import { LeafletMap } from './leaflet-map';

export const LeafletContainer: React.FC = () => { 
    const { position, error } = useGeoLocation();
    const { userLocation } = useUserDefaultLocation(position);

    return <MapContainer className="leaflet-map" zoom={13} center={userLocation}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
       <LeafletMap />
    </MapContainer>;
}