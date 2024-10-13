import { LatLngExpression, divIcon, LeafletEventHandlerFnMap } from 'leaflet';
import { FC, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Marker } from 'react-leaflet';

export const DivIconMarker: FC<{
  children: ReactNode;
  draggable?: boolean;
  eventHandlers?: LeafletEventHandlerFnMap;
  iconAnchor?: [number, number];
  position: LatLngExpression;
}> = ({ children, draggable, eventHandlers, iconAnchor, position }) => {
  const iconDiv = useMemo(() => document.createElement('div'), []);
  return (
    <>
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        icon={divIcon({
          className: '',
          html: iconDiv,
          iconAnchor,
        })}
        position={position}
      />
      {createPortal(children, iconDiv)}
    </>
  );
};
