import { useEffect, useRef, useState } from 'react';
import { Map as MapType, MapMouseEvent } from 'maplibre-gl';

import { ZetkinLocation } from 'utils/types/zetkin';

interface UseMapMarkerDragArgs {
  map: MapType | null;
  inMoveState: boolean;
  selectedLocation?: ZetkinLocation;
  layerId: string;
  onDragEnd: (lat: number, lng: number) => void;
}

export default function useMapMarkerDrag({
  map,
  inMoveState,
  selectedLocation,
  layerId,
  onDragEnd,
}: UseMapMarkerDragArgs) {
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const [dragPosition, setDragPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const dragPositionRef = useRef<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!map || !inMoveState || !selectedLocation) {
      setIsDragging(false);
      isDraggingRef.current = false;
      setDragPosition(null);
      dragPositionRef.current = null;
      return;
    }

    const onMouseDown = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerId],
      });

      if (
        !features.length ||
        !features.some((feature) => {
          const location: ZetkinLocation =
            typeof feature.properties.location === 'string'
              ? JSON.parse(feature.properties.location) // maplibre seems to output json strings here for some reason
              : feature.properties.location;
          const locationId = location.id;
          return locationId === selectedLocation.id;
        })
      ) {
        return;
      }

      map.dragPan.disable();
      map.getCanvas().style.cursor = 'grabbing';
      setIsDragging(true);
      isDraggingRef.current = true;
    };

    const onMouseMove = (e: MapMouseEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      const newPos = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      };
      setDragPosition(newPos);
      dragPositionRef.current = newPos;
    };

    const onMouseUp = () => {
      if (!isDraggingRef.current || !dragPositionRef.current) {
        return;
      }

      map.dragPan.enable();
      map.getCanvas().style.cursor = '';
      setIsDragging(false);
      isDraggingRef.current = false;

      onDragEnd(dragPositionRef.current.lat, dragPositionRef.current.lng);
    };

    map.on('mousedown', onMouseDown);
    map.on('mousemove', onMouseMove);
    map.on('mouseup', onMouseUp);

    return () => {
      map.off('mousedown', onMouseDown);
      map.off('mousemove', onMouseMove);
      map.off('mouseup', onMouseUp);
      map.dragPan.enable();
      map.getCanvas().style.cursor = '';
    };
  }, [map, inMoveState, selectedLocation, layerId, onDragEnd]);

  return {
    dragPosition,
    isDragging,
  };
}
