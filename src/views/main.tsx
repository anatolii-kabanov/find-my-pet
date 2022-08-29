import { LeafletContainer } from "../maps/leaflet/leaflet-container";
import { MapboxContainer } from "../maps/mapbox/mapbox-container";

export const Main: React.FC = () => {
    return (
        <div className="row">
            <div className="col">
                <LeafletContainer />
            </div>
            <div className="col">
                <MapboxContainer />
            </div>
        </div>
    );
}