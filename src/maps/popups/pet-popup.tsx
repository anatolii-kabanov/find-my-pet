import { Button } from 'react-bootstrap';
import { Coordinates } from '../../models';
import './pet-popup.css';

interface PetPopupProps {
    avatar: string;
    description: string;
    name: string;
    coordinates: Coordinates;
    getDirection: (coordinates: Coordinates) => void;
}

export const PetPopup: React.FC<PetPopupProps> = ({ avatar, description, name, coordinates, getDirection }) => {
    return (
        <div className="pet-popup">
            <img src={avatar} className="pet-popup-img"/>
            <div>Name: <h4>{name}</h4></div>
            <Button onClick={() => getDirection(coordinates)}>Direction</Button>
            <p>{description}</p>
        </div>
    );
}