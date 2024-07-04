import { LatLngExpression, divIcon, LeafletEventHandlerFnMap } from 'leaflet';
import { FC, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Marker } from 'react-leaflet';

export const DivIconMarker: FC<{
  children: ReactNode;
  draggable?: boolean;
  eventHandlers?: LeafletEventHandlerFnMap;
  position: LatLngExpression;
}> = ({ children, draggable, eventHandlers, position }) => {
  const iconDiv = useMemo(() => document.createElement('div'), []);
  return (
    <>
      <Marker
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
