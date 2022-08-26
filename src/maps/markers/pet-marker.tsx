import './pet-marker.css';

interface PetMarkerProps {
    avatar: string;
}

export const PetMarker: React.FC<PetMarkerProps> = ({ avatar }) => {
    return (
        <img src={avatar} className="pet-marker"/>
    );
}