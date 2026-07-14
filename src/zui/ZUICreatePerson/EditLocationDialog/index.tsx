import 'maplibre-gl/dist/maplibre-gl.css';

import { InfoOutline } from '@mui/icons-material';
import { Box, Button, Dialog, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { FC, useState } from 'react';

import { ZetkinLngLatFieldValue } from 'utils/types/zetkin';
import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

export type PendingLocation = {
  lat: number;
  lng: number;
};

interface EditLocationDialogProps {
  initialLocation?: ZetkinLngLatFieldValue;
  onMapClose: () => void;
  onSelectLocation: (location: ZetkinLngLatFieldValue) => void;
  onClearLocation: () => void;
  open: boolean;
}

const Map = dynamic(() => import('./Map'), { ssr: false });
const EditLocationDialog: FC<EditLocationDialogProps> = ({
  initialLocation,
  onMapClose,
  onSelectLocation,
  onClearLocation,
  open,
}) => {
  const [pendingLocation, setPendingLocation] =
    useState<ZetkinLngLatFieldValue | null>(initialLocation ?? null);

  const saveAndClose = () => {
    if (pendingLocation) {
      onSelectLocation(pendingLocation);
    }
    setPendingLocation(null);
    onMapClose();
  };

  return (
    <Dialog fullWidth maxWidth="lg" onClose={() => saveAndClose()} open={open}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}
      >
        <Map
          initialLocation={pendingLocation ?? initialLocation}
          onMapClick={(latlng) => {
            setPendingLocation(latlng);
          }}
          pendingLocation={pendingLocation}
        />
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <InfoOutline />
          <Typography>
            <Msg id={messageIds.createPerson.location.dialog.mapInfo} />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            disabled={!initialLocation && !pendingLocation}
            onClick={() => {
              setPendingLocation(null);
              onClearLocation();
            }}
            variant="outlined"
          >
            <Msg id={messageIds.createPerson.location.dialog.clearButton} />
          </Button>
          <Button onClick={() => saveAndClose()} variant="contained">
            <Msg id={messageIds.createPerson.location.dialog.doneButton} />
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditLocationDialog;
