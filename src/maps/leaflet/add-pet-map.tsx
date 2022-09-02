import markerIcon from "leaflet/dist/images/marker-icon.png"
import { Marker, useMapEvents } from 'react-leaflet';
import useGeoLocation from '../../hooks/geo-location-hook';
import useUserDefaultLocation from '../../hooks/user-default-location-hook';
import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { Coordinates } from "../../models";

interface AddPetMapProps {
    setPosition: (coordinates: Coordinates) => void;
}

export const AddPetMap: React.FC<AddPetMapProps> = ({ setPosition }) => {
    const { position } = useGeoLocation();
    const { userLocation } = useUserDefaultLocation(position);

    const markerRef = useRef<L.Marker>(null);
    const map = useMapEvents({
        click(e) {
            markerRef.current?.setLatLng(e.latlng);
            setPosition(e.latlng)
        }
    });

    useEffect(() => {
        map.setView(userLocation);
    }, [userLocation]);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setPosition(marker.getLatLng())
                }
            },
        }),
        [],
    )

    const userIcon = L.icon({
        iconUrl: markerIcon,
        iconSize: [22, 38],
        iconAnchor: [11, 19],
    });
    return <div>
        <Marker position={userLocation} icon={userIcon} draggable={true} eventHandlers={eventHandlers} ref={markerRef} />
    </div>;
}