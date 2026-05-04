import { useEffect, useState } from 'react';
import { MapLayerMouseEvent, MapMouseEvent, Map as MapType } from 'maplibre-gl';
import distance from '@turf/distance';

import { Zetkin2Area, Zetkin2AreaLine } from 'features/areas/types';
import lngLat from '../utils/lngLat';

type Props = {
  map: MapType | null;
  selectedArea: Zetkin2Area | null;
};

type Return = {
  draggingPoints: Zetkin2AreaLine | null;
  editing: boolean;
  editingArea: Zetkin2Area | null;
  setEditing: (editing: boolean) => void;
};

export default function useAreaEditing({ map, selectedArea }: Props): Return {
  const [editingArea, setEditingArea] = useState<Zetkin2Area | null>(null);
  const [draggingPoints, setDraggingPoints] = useState<Zetkin2AreaLine | null>(
    null
  );

  const editing = !!editingArea;

  useEffect(() => {
    if (map) {
      let draggedPointIndex: number | null = null;
      let updatedPoints: Zetkin2AreaLine | null = null;

      const handleDragStart = (ev: MapLayerMouseEvent) => {
        const line = editingArea?.boundary.coordinates[0];
        if (line) {
          const lineWithoutLast = line.slice(0, -1);
          const sortedCoords = lineWithoutLast
            .concat()
            .sort(
              (c0, c1) =>
                distance(c0, ev.lngLat.toArray()) -
                distance(c1, ev.lngLat.toArray())
            );
          const nearestCoord = sortedCoords[0];
          draggedPointIndex = lineWithoutLast.indexOf(nearestCoord);

          setDraggingPoints(line);
          map.on('mousemove', handleDragMove);
          map.on('mouseup', handleDragEnd);
          ev.preventDefault();
        } else {
          draggedPointIndex = null;
        }
      };

      const handleDragMove = (ev: MapMouseEvent) => {
        setDraggingPoints((current) => {
          if (current) {
            updatedPoints = current;
            const isDraggingFirst = draggedPointIndex === 0;
            return current.map((originalLngLat, index) => {
              const isDraggedPoint = index === draggedPointIndex;
              const isLastPoint = index === current.length - 1;
              const shouldReplace =
                isDraggedPoint || (isDraggingFirst && isLastPoint);

              return shouldReplace
                ? lngLat(ev.lngLat.toArray())
                : originalLngLat;
            });
          } else {
            return null;
          }
        });
      };

      const handleDragEnd = () => {
        map.off('mousemove', handleDragMove);
        map.off('mouseup', handleDragEnd);
        draggedPointIndex = null;

        if (editingArea && updatedPoints) {
          setDraggingPoints(null);
          setEditingArea({
            ...editingArea,
            boundary: {
              ...editingArea?.boundary,
              coordinates: [updatedPoints],
            },
          });
        }
      };

      setDraggingPoints(null);
      map.on('mousedown', 'editPoints', handleDragStart);

      return () => {
        map.off('mousedown', 'editPoints', handleDragStart);
        map.off('mousemove', handleDragMove);
        map.off('mouseup', handleDragEnd);
      };
    }
  }, [map, selectedArea, editingArea]);

  return {
    draggingPoints,
    editing,
    editingArea,
    setEditing(editing) {
      setEditingArea(editing ? selectedArea : null);
    },
  };
}
