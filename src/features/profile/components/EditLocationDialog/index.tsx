import 'leaflet/dist/leaflet.css';

import { Box, Dialog } from '@mui/material';
import dynamic from 'next/dynamic';
import { FC, useEffect, useState } from 'react';

import { ZetkinLocation } from 'utils/types/zetkin';

export type PendingLocation = {
  lat: number;
  lng: number;
};

interface EditLocationDialogProps {
  initialLocation?: Pick<ZetkinLocation, 'lat' | 'lng'>;
  onMapClose: () => void;
  onSelectLocation: (location: Pick<ZetkinLocation, 'lat' | 'lng'>) => void;
  open: boolean;
}

const Map = dynamic(() => import('./Map'), { ssr: false });
const EditLocationDialog: FC<EditLocationDialogProps> = ({
  initialLocation,
  onMapClose,
  onSelectLocation,
  open,
}) => {
  const [pendingLocation, setPendingLocation] = useState<Pick<
    ZetkinLocation,
    'lat' | 'lng'
  > | null>(initialLocation ?? null);

  useEffect(() => {
    if (open) {
      if (initialLocation) {
        setPendingLocation(initialLocation);
      } else {
        setPendingLocation(null);
      }
    } else {
      setPendingLocation(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      onClose={() => {
        if (pendingLocation) {
          onSelectLocation(pendingLocation);
        }
        onMapClose();
      }}
      open={open}
    >
      <Box border={1} padding={2}>
        <Map
          initialLocation={pendingLocation ?? initialLocation}
          onMapClick={(latlng) => {
            setPendingLocation(latlng);
          }}
          pendingLocation={pendingLocation}
        />
      </Box>
    </Dialog>
  );
};

export default EditLocationDialog;
