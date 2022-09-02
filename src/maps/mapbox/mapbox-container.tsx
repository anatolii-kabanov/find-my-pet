import './mapbox-container.css';
import mapboxgl, { Map, Marker, Popup } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import useGeoLocation from '../../hooks/geo-location-hook';
import { getPets } from '../../local-storage/store';
import ReactDOM from 'react-dom/client';
import { PetMarker } from '../markers/pet-marker';
import { PetPopup } from '../popups/pet-popup';
import { Coordinates } from '../../models';
import useUserDefaultLocation from '../../hooks/user-default-location-hook';

export const MapboxContainer: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map>();
    const { position, error } = useGeoLocation();
    const { userLocation } = useUserDefaultLocation(position);

    const userMarker = new Marker();
    const pets = getPets();

    const getDirection = (coordintes: Coordinates) => {
        fetch(`https://api.mapbox.com/directions/v5/mapbox/cycling/${userLocation.lng},${userLocation.lat};${coordintes.lng},${coordintes.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
            .then((response) => response.json())
            .then((data) => {
                const mapbox = map.current;
                if (mapbox) {
                    const route = data.routes[0].geometry.coordinates;
                    const geojson = {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: route
                        }
                    } as any;
                    const routeSource = mapbox.getSource('route') as any;
                    if (routeSource) {
                        routeSource.setData(geojson);
                    } else {
                        mapbox.addLayer({
                            id: 'route',
                            type: 'line',
                            source: {
                                type: 'geojson',
                                data: geojson,
                            },
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            paint: {
                                'line-color': '#3887be',
                                'line-width': 5,
                                'line-opacity': 0.75
                            }
                        });
                    }
                }
            });
    }

    useEffect(() => {
        if (position && map.current) {
            const lngLat = { lat: position.latitude, lng: position.longitude };
            map.current.setCenter(lngLat);
            userMarker.setLngLat(lngLat).addTo(map.current);
        }
    }, [position, map.current])

    useEffect(() => {
        if (!map.current) {
            map.current = new Map({
                container: mapContainer.current ?? '',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [userLocation.lng, userLocation.lat],
                zoom: userLocation.zoom
            });
        }
        pets.forEach((p) => {
            const markerEl = document.createElement('div');
            const markerRoot = ReactDOM.createRoot(markerEl);
            markerRoot.render(<PetMarker avatar={p.avatar} />);
            const marker = new Marker(markerEl);

            const popupEl = document.createElement('div');
            const popupRoot = ReactDOM.createRoot(popupEl);
            const popup = new Popup();
            const getDirectionCallback = (coordinates: Coordinates) => {
                getDirection(coordinates);
                popup.remove();
            }
            popupRoot.render(
                <PetPopup
                    avatar={p.avatar}
                    description={p.description}
                    name={p.name}
                    coordinates={p.coordinates}
                    getDirection={getDirectionCallback} />
            );
            popup.setDOMContent(popupEl);
            marker.setLngLat(p.coordinates).setPopup(popup).addTo(map.current!);
        })
    }, [pets]);

    return (
        <div className="mapbox">
            <div className="error">{error}</div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}