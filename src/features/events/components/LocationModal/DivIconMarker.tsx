import { divIcon } from 'leaflet';
import { FC, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Marker, MarkerProps } from 'react-leaflet';

export const DivIconMarker: FC<
  {
    iconAnchor?: [number, number];
  } & Pick<
    MarkerProps,
    'children' | 'draggable' | 'eventHandlers' | 'position' | 'zIndexOffset'
  >
> = ({
  children,
  draggable,
  eventHandlers,
  iconAnchor,
  position,
  zIndexOffset,
}) => {
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
        zIndexOffset={zIndexOffset}
      />
      {createPortal(children, iconDiv)}
    </>
  );
};
