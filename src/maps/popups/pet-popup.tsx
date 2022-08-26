import './pet-popup.css';

interface PetPopupProps {
    avatar: string;
    description: string;
    name: string;
}

export const PetPopup: React.FC<PetPopupProps> = ({ avatar, description, name }) => {
    return (
        <div className="pet-popup">
            <img src={avatar} className="pet-popup-img"/>
            <div>Name: <h4>{name}</h4></div>
            <p>{description}</p>
        </div>
    );
}