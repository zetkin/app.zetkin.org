import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import QRCode from 'qrcode';
import { FC, useEffect, useState } from 'react';

import { useMessages } from 'core/i18n';
import {
  encodeFloorShare,
  FloorShare,
} from 'features/canvass/utils/floorShare';
import messageIds from 'features/canvass/l10n/messageIds';
import { HouseholdItem } from './types';

type Props = {
  floor: number;
  householdItems: HouseholdItem[];
  locationTitle: string;
  onClose: () => void;
  open: boolean;
};

const QRCodeDialog: FC<Props> = ({
  floor,
  householdItems,
  locationTitle,
  onClose,
  open,
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const messages = useMessages(messageIds);

  useEffect(() => {
    let cancelled = false;

    if (!open) {
      setQrCode(null);
      return;
    }

    const choiceMetrics = (householdItems[0]?.metrics || []).filter(
      (metric) => metric.type === 'bool'
    );
    const share: FloorShare = {
      floor,
      households: householdItems.map(({ lastVisitMetrics }) => ({
        responses: choiceMetrics.map((metric) => {
          const response = lastVisitMetrics?.find(
            (response) => response.metric_id === metric.id
          )?.response;

          return response === 'yes' ? 'yes' : response === 'no' ? 'no' : null;
        }),
      })),
      questions: choiceMetrics.map(({ question }) => question),
      recentlyVisited: householdItems.map(({ lastVisitTime }) => {
        if (!lastVisitTime) {
          return false;
        }

        const normalizedVisitTime = lastVisitTime.includes('Z')
          ? lastVisitTime
          : lastVisitTime.concat('Z');
        const visitedAt = Date.parse(normalizedVisitTime);
        const age = Date.now() - visitedAt;
        return (
          !Number.isNaN(visitedAt) && age >= 0 && age <= 3 * 60 * 60 * 1000
        );
      }),
      successMask: choiceMetrics.reduce(
        (mask, metric, index) =>
          mask | (metric.defines_success ? 1 << index : 0),
        0
      ),
    };
    const qrUrl = `${window.location.origin}/canvass/share?d=${encodeFloorShare(share)}`;

    QRCode.toDataURL(qrUrl).then((dataUrl) => {
      if (!cancelled) {
        setQrCode(dataUrl);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [floor, householdItems, open]);

  return (
    <Dialog
      fullWidth
      onClose={onClose}
      open={open}
      sx={(theme) => ({ zIndex: theme.zIndex.tooltip + 9999 })}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>{locationTitle}</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle1">
          {messages.households.single.subtitle({ floorNumber: floor })}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {messages.households.qrCode.instruction()}
        </Typography>
        {qrCode && (
          <>
            <Box
              alt={`QR code for floor ${floor}`}
              component="img"
              src={qrCode}
              sx={{ display: 'block', height: 280, margin: 'auto', width: 280 }}
            />
            <Box display="flex" justifyContent="center" mt={2}>
              <Button onClick={onClose} variant="contained">
                {messages.households.qrCode.closeButton()}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
