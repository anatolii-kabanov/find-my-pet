import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPet } from "../../local-storage/store";
import { Coordinates, Pet } from "../../models";
import { PetForm } from "../forms/pet-form"
import { AddPetMap } from "./add-pet-map";
import { LeafletContainer } from "./leaflet-container";

export const AddPetForm: React.FC = () => {
    const [coordinates, setCoordinates] = useState<Coordinates>();
    
    const navigate = useNavigate();
    
    const onSubmit = (pet: Omit<Pet, 'coordinates'>) => {
        console.log('coor', coordinates)
        if (!coordinates) return;
        const newPet: Pet = {
            ...pet,
            coordinates: {
                lat: coordinates.lat,
                lng: coordinates.lng
            }
        };
        addPet(newPet);
        navigate('../');
    }

    return <div>
          <PetForm submit={onSubmit}/>
          <LeafletContainer>
            <AddPetMap setPosition={setCoordinates}/>
          </LeafletContainer>
    </div>
}