export interface Pet {
    name: string;
    description: string;
    coordinates: Coordinates;
    /**
     * URL to pet picture
     */
    avatar: string; 
}

export interface Coordinates {
    lat: number; 
    lng: number;
}
