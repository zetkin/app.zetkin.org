import { FunctionComponent } from 'react';

export interface MapMarker {
    id?: number;
    lat: number;
    lng: number;
    title: string;
}

export interface MapProps {
    height?: string | number;
    markers: MapMarker[];
    width?: string | number;
}

export type MapComponent = FunctionComponent<MapProps>;
