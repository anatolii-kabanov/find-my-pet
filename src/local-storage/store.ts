import { Pet, Store } from "../models";

export function getPets(): Pet[] {
    const petsItem = localStorage.getItem(Store.Pets);
    const petsArray = petsItem ? JSON.parse(petsItem) as Array<Pet> : [];
    return petsArray;
}

export function addPet(pet: Pet) {
    const petsArray = getPets();
    petsArray.push(pet);
    localStorage.setItem(Store.Pets, JSON.stringify(petsArray));
}
