import './leaflet-container.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import useGeoLocation from '../../hooks/geo-location-hook';
import useUserDefaultLocation from '../../hooks/user-default-location-hook';

interface LeafletContainerProps {
    children: React.ReactNode;
}

export const LeafletContainer: React.FC<LeafletContainerProps> = ({ children }) => { 
    const { position } = useGeoLocation();
    const { userLocation } = useUserDefaultLocation(position);

    return <MapContainer className="leaflet-map" zoom={userLocation.zoom} center={userLocation}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
       {children}
    </MapContainer>;
}