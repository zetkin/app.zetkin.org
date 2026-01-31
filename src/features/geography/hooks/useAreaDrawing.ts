import { MapMouseEvent, Map as MapType } from 'maplibre-gl';
import { useEffect, useState } from 'react';

import { useMessages } from 'core/i18n';
import useCreateArea from 'features/areas/hooks/useCreateArea';
import messageIds from 'features/areas/l10n/messageIds';
import { PointData, Zetkin2AreaLine } from 'features/areas/types';
import lngLat from '../utils/lngLat';

type Props = {
  map: MapType | null;
  orgId: number;
  setDrawing: (drawing: boolean) => void;
  setSelectedId: (id: number) => void;
};

type Return = {
  canFinishDrawing: boolean;
  cancelDrawing: () => void;
  creating: boolean;
  drawingPoints: Zetkin2AreaLine | null;
  finishDrawing: () => void;
  startDrawing: () => void;
};

export default function useAreaDrawing({
  map,
  orgId,
  setSelectedId,
  setDrawing,
}: Props): Return {
  const messages = useMessages(messageIds);
  const [drawingPoints, setDrawingPoints] = useState<Zetkin2AreaLine | null>(
    null
  );
  const [mousePos, setMousePos] = useState<PointData | null>(null);
  const [creating, setCreating] = useState(false);
  const createArea = useCreateArea(orgId);

  async function finishDrawing() {
    if (drawingPoints && drawingPoints.length > 2) {
      setCreating(true);
      const area = await createArea({
        boundary: {
          coordinates: [[...drawingPoints, drawingPoints[0]]],
          type: 'Polygon',
        },
        description: '',
        title: messages.areas.default.title(),
      });
      setCreating(false);
      setSelectedId(area.id);
    }
    setDrawingPoints(null);
    setDrawing(false);
  }

  useEffect(() => {
    const handleClick = (ev: MapMouseEvent) => {
      const drawing = !!drawingPoints && !creating;

      if (drawing) {
        if (drawingPoints.length > 1) {
          const firstCoord = drawingPoints[0];
          const firstOnScreen = ev.target.project(firstCoord);
          const distanceFromCursor = firstOnScreen.dist(ev.point);

          if (distanceFromCursor < 10) {
            finishDrawing();
            return;
          }
        }

        setDrawingPoints([...drawingPoints, lngLat(ev.lngLat.toArray())]);
      }
    };

    const handleMove = (ev: MapMouseEvent) => {
      setMousePos(lngLat(ev.lngLat.toArray()));
    };

    map?.on('click', handleClick);
    map?.on('mousemove', handleMove);

    return () => {
      map?.off('click', handleClick);
      map?.off('mousemove', handleMove);
    };
  }, [drawingPoints, map]);

  const startedDrawing = !!drawingPoints && drawingPoints.length > 0;

  return {
    canFinishDrawing: !!drawingPoints && drawingPoints.length > 2,
    cancelDrawing() {
      setDrawing(false);
      setDrawingPoints(null);
    },
    creating,
    drawingPoints:
      startedDrawing && mousePos && !creating
        ? [...drawingPoints, mousePos]
        : drawingPoints,
    finishDrawing,
    startDrawing() {
      setDrawing(true);
      setDrawingPoints([]);
    },
  };
}
