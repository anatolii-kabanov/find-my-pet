import './mapbox-container.css';
import { Map, Marker, Popup } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import useGeoLocation from '../../hooks/geo-location-hook';
import { getPets } from '../../local-storage/store';
import ReactDOM from 'react-dom/client';
import { PetMarker } from '../markers/pet-marker';
import { PetPopup } from '../popups/pet-popup';

export const MapboxContainer: React.FC = () =>  {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map>();
    const { position, error } = useGeoLocation();
    const [lng, setLng] = useState(position?.longitude ?? -70.9);
    const [lat, setLat] = useState(position?.latitude ?? 42.35);
    const [zoom, setZoom] = useState(9);
    const pets = getPets();

    useEffect(() => {
        if (!map.current) {
            map.current = new Map({
                container: mapContainer.current ?? '',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });
        }
        pets.forEach((p) => {
            const markerEl = document.createElement('div');
            const markerRoot = ReactDOM.createRoot(markerEl);
            markerRoot.render(<PetMarker avatar={p.avatar}/>);
            const marker = new Marker(markerEl);

            const popupEl = document.createElement('div');
            const popupRoot = ReactDOM.createRoot(popupEl);
            popupRoot.render(<PetPopup avatar={p.avatar} description={p.description} name={p.name}/>)
            const popup = new Popup().setDOMContent(popupEl);
            marker.setLngLat(p.coordinates).setPopup(popup).addTo(map.current!);
        })
    });

    return (
        <div className="mapbox">
            <div className="error">{error}</div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
  }