import { MapProps } from './types';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function Map({ markers }: MapProps): JSX.Element {
    const latSum = markers.reduce((sum, marker) => sum + marker.lat, 0);
    const lngSum = markers.reduce((sum, marker) => sum + marker.lng, 0);

    const avgPos: [number, number] = [latSum/markers.length, lngSum/markers.length];

    return (
        <>
            <MapContainer center={ avgPos } scrollWheelZoom={ false } zoom={ 13 }>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    markers.map((marker, index) => (
                        <Marker key={ marker.id || index } position={ [marker.lat, marker.lng] }>
                            <Popup>
                                { marker.title }
                            </Popup>
                        </Marker>
                    ))
                };
            </MapContainer>
        </>
    );
}


