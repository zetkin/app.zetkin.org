import { FC, useEffect, useRef, useState } from 'react';
import {
  AttributionControl,
  FeatureGroup,
  Polygon,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { FeatureGroup as FeatureGroupType } from 'leaflet';
import { useTheme } from '@mui/styles';
import { Box } from '@mui/material';

import { ZetkinArea, ZetkinCanvassSession } from '../types';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import ZUIAvatar from 'zui/ZUIAvatar';

type PlanMapRendererProps = {
  areas: ZetkinArea[];
  onSelectedIdChange: (newId: string) => void;
  selectedId: string;
  sessions: ZetkinCanvassSession[];
};

const PlanMapRenderer: FC<PlanMapRendererProps> = ({
  areas,
  selectedId,
  sessions,
  onSelectedIdChange,
}) => {
  const theme = useTheme();
  const reactFGref = useRef<FeatureGroupType | null>(null);

  const [zoomed, setZoomed] = useState(false);
  const [zoom, setZoom] = useState(0);

  const map = useMapEvents({
    zoom: () => {
      setZoom(map.getZoom());
      setZoomed(true);
    },
  });

  useEffect(() => {
    if (map && !zoomed) {
      const bounds = reactFGref.current?.getBounds();
      if (bounds?.isValid()) {
        map.fitBounds(bounds);
        setZoomed(true);
      }
    }
  }, [areas, map]);
  return (
    <>
      <AttributionControl position="bottomright" prefix={false} />
      <TileLayer
        attribution="<span style='color:#a3a3a3;'>Leaflet & OpenStreetMap</span>"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup
        ref={(fgRef) => {
          reactFGref.current = fgRef;
        }}
      >
        {areas.map((area) => {
          const selected = selectedId == area.id;

          const mid: [number, number] = [0, 0];
          if (area.points.length) {
            area.points
              .map((input) => {
                if ('lat' in input && 'lng' in input) {
                  return [input.lat as number, input.lng as number];
                } else {
                  return input;
                }
              })
              .forEach((point) => {
                mid[0] += point[0];
                mid[1] += point[1];
              });

            mid[0] /= area.points.length;
            mid[1] /= area.points.length;
          }

          const detailed = zoom >= 15;

          const people = sessions
            .filter((session) => session.area.id == area.id)
            .map((session) => session.assignee);

          const hasPeople = !!people.length;

          // The key changes when selected, to force redraw of polygon
          // to reflect new state through visual style
          const key =
            area.id +
            (selected ? '-selected' : '-default') +
            (hasPeople ? '-assigned' : '');

          return (
            <>
              {hasPeople && (
                <DivIconMarker position={mid}>
                  {detailed && (
                    <Box display="flex">
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '1px',
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {people.map((person) => (
                          <Box
                            key={person.id}
                            sx={{
                              borderRadius: '50%',
                              boxShadow: '0 0 8px rgba(0,0,0,0.3)',
                            }}
                          >
                            <ZUIAvatar
                              size={zoom >= 16 ? 'sm' : 'xs'}
                              url={`/api/orgs/1/people/${person.id}/avatar`}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                  {!detailed && (
                    <Box
                      sx={{
                        alignItems: 'center',
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 10,
                        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
                        color: theme.palette.primary.contrastText,
                        display: 'flex',
                        fontWeight: 'bold',
                        height: 30,
                        justifyContent: 'center',
                        transform: 'translate(-50%, -50%)',
                        width: 30,
                      }}
                    >
                      <Box>{people.length}</Box>
                    </Box>
                  )}
                </DivIconMarker>
              )}
              <Polygon
                key={key}
                color={
                  hasPeople
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main
                }
                eventHandlers={{
                  click: () => {
                    onSelectedIdChange(area.id);
                  },
                }}
                positions={area.points}
                weight={selected ? 5 : 2}
              />
            </>
          );
        })}
      </FeatureGroup>
    </>
  );
};

export default PlanMapRenderer;
