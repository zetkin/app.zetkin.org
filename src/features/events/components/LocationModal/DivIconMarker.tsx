import {
  LeafletEventHandlerFnMap,
  Marker as MarkerType,
  LatLngExpression,
  divIcon,
} from 'leaflet';
import { FC, ReactNode, Ref, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Marker } from 'react-leaflet';

export const DivIconMarker: FC<{
  children: ReactNode;
  draggable?: boolean;
  eventHandlers?: LeafletEventHandlerFnMap;
  markerRef?: Ref<MarkerType> | undefined;
  position: LatLngExpression;
}> = ({ children, draggable, eventHandlers, markerRef, position }) => {
  const iconDiv = useMemo(() => document.createElement('div'), []);
  return (
    <>
      <Marker
        ref={markerRef}
        draggable={draggable}
        eventHandlers={eventHandlers}
        icon={divIcon({
          className: '',
          html: iconDiv,
        })}
        position={position}
      />
      {createPortal(children, iconDiv)}
    </>
  );
};
