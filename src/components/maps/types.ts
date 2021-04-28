import { FunctionComponent } from 'react';

export interface MapMarker {
    id?: number;
    lat: number;
    lng: number;
    title: string;
}

export interface MapProps {
    markers: MapMarker[];
}

export type MapComponent = FunctionComponent<MapProps>;
