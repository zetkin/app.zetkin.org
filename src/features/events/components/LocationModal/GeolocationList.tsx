import { PendingLocation } from ".";

interface GeolocationListProps {
    locations: PendingLocation[];
}

const GeolocationList = ({locations}: GeolocationListProps) => {
    return (locations.map(((location, index) => {
        return <div key={index}>{location.name}</div>
    })))
}

export default GeolocationList;