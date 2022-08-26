export interface Pet {
    name: string;
    description: string;
    coordinates: { lat: number; lng: number; };
    /**
     * URL to pet picture
     */
    avatar: string; 
}
