import './mapbox-container.css';
import mapboxgl, { Map, Marker } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import useGeoLocation from '../../hooks/geo-location-hook';
import { useNavigate } from "react-router-dom";
import MapboxGeocoder, { Result } from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Coordinates, Pet } from '../../models';
import { addPet } from '../../local-storage/store';
import useUserDefaultLocation from '../../hooks/user-default-location-hook';
import { PetForm } from '../forms/pet-form';

export const AddPetForm: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map>();
    const { position, error } = useGeoLocation();
    const { userLocation } = useUserDefaultLocation(position);
    const [coordinates, setCoordinates] = useState<Coordinates>();

    const navigate = useNavigate();

    const marker = useRef<Marker>(new Marker());

    const addMarkerOnClick = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        if (map.current) {
            marker.current.setLngLat(event.lngLat).addTo(map.current);
            setCoordinates(event.lngLat);
        }
    }

    const onSubmit = (pet: Omit<Pet, 'coordinates'>) => {
        if (!coordinates) return;
        const newPet: Pet = {
            ...pet,
            coordinates: {
                lat: coordinates.lat,
                lng: coordinates.lng
            }
        };
        ;
        addPet(newPet);
        navigate('../');
    }

    useEffect(() => {
        if (position && map.current) {
            map.current.setCenter({ lat: position.latitude, lng: position.longitude });
        }
    }, [position, map.current])

    useEffect(() => {
        if (map.current) return;
        map.current = new Map({
            container: mapContainer.current ?? '',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [userLocation.lng, userLocation.lat],
            zoom: userLocation.zoom
        });
        map.current.on('click', addMarkerOnClick);
        const geocoder = new MapboxGeocoder({
            // Initialize the geocoder
            accessToken: mapboxgl.accessToken, // Set the access token
            mapboxgl: mapboxgl, // Set the mapbox-gl instance
            marker: false, // Do not use the default marker style
        });

        geocoder.on('result', (event: { result: Result }) => {
            const [lng, lat] = event.result.center;
            const latLng = { lat, lng };
            marker.current.setLngLat(latLng).addTo(map.current!);
            setCoordinates(latLng);
        });
        // Add the geocoder to the map
        map.current.addControl(geocoder);
    });

    return (
        <div>
            <PetForm submit={onSubmit} />
            <div className="mapbox">
                <div>{marker.current.getLngLat()?.toString()}</div>
                <div className="error">{error}</div>
                <div ref={mapContainer} className="map-container" />
            </div>
        </div>
    );
}