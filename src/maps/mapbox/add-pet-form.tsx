import './mapbox-container.css';
import mapboxgl, { Map, Marker } from "mapbox-gl";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import useGeoLocation from '../../hooks/geo-location-hook';
import { useNavigate } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Pet } from '../../models';
import { addPet } from '../../local-storage/store';
import useUserDefaultLocation from '../../hooks/user-default-location-hook';

export const AddPetForm: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map>();
    const { position, error } = useGeoLocation();
    const { userLocation } = useUserDefaultLocation(position);

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
    const [coordinates, setCoordinates] = useState<mapboxgl.LngLat>();

    const navigate = useNavigate();

    const marker = new Marker();

    const addMarkerOnClick = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        if (map.current) {
            marker.setLngLat(event.lngLat).addTo(map.current);
            setCoordinates(event.lngLat);
        }
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!coordinates) return;
        const newPet: Pet = {
            name,
            description,
            coordinates: {
                lat: coordinates.lat,
                lng: coordinates.lng
            },
            avatar
        };
        addPet(newPet);
        navigate('../');
    }

    const onNameChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value);
    }

    const onAvatarChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAvatar(e.target.value);
    }

    const onDescriptionChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(e.target.value);
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
            zoom: 9
        });
        map.current.on('click', addMarkerOnClick);
        const geocoder = new MapboxGeocoder({
            // Initialize the geocoder
            accessToken: mapboxgl.accessToken, // Set the access token
            mapboxgl: mapboxgl, // Set the mapbox-gl instance
            marker: false, // Do not use the default marker style
          });
        // Add the geocoder to the map
        map.current.addControl(geocoder);
    });

    return (
        <Form className="p-3" onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="pets-name">
                <Form.Label>Pets name</Form.Label>
                <Form.Control type="text" placeholder="Enter animal alias" value={name} onChange={onNameChanged}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="pets-avatar">
                <Form.Label>Avatar</Form.Label>
                <Form.Control type="text" placeholder="Enter url to the pets photo" value={avatar} onChange={onAvatarChanged}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="pets-description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Leave some short description"
                    style={{ height: '100px' }}
                    value={description}
                    onChange={onDescriptionChanged}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>

            <div className="mapbox">
                <div className="error">{error}</div>
                <div ref={mapContainer} className="map-container" />
            </div>
        </Form>
    );
}