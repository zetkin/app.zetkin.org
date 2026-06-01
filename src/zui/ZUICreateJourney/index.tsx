import {
  Box,
  Button,
  Dialog,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, MouseEvent, useState } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';
import JourneyInfoForm from './JourneyInfoForm';
import useCreateJourney from 'features/journeys/hooks/useCreateJourney';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCreateJourney, ZetkinJourney } from 'utils/types/zetkin';
import zuiMessages from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface ZUICreateJourneyProps {
  initialValues?: ZetkinCreateJourney;
  onClose: () => void;
  onSubmit?: (e: MouseEvent<HTMLButtonElement>, journey: ZetkinJourney) => void;
  open: boolean;
  title?: string;
  submitLabel?: string;
}

const ZUICreateJourney: FC<ZUICreateJourneyProps> = ({
  initialValues,
  open,
  onClose,
  onSubmit,
  title,
  submitLabel,
}) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const createJourney = useCreateJourney(orgId);

  const [journeyInfo, setJourneyInfo] = useState<ZetkinCreateJourney>({
    ...initialValues,
  });
  const messages = useMessages(zuiMessages);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        onClose();
        setJourneyInfo({});
      }}
      open={open}
    >
      <Box sx={{ padding: '40px 0 40px 40px' }}>
        <Box display="flex">
          <Typography sx={{ ml: 0.5 }} variant="h5">
            {title ?? messages.createJourney.title()}
          </Typography>
        </Box>
        <JourneyInfoForm
          journeyInfo={journeyInfo}
          onChange={(field, value) => {
            if (value === '') {
              const copied = { ...journeyInfo };
              delete copied[field];
              if (field === 'title') {
                delete copied['singular_label'];
              }
              setJourneyInfo(copied);
            } else {
              setJourneyInfo((prev) => {
                if (field === 'title') {
                  return {
                    ...prev,
                    [field]: value as string,
                    ['singular_label']: value as string,
                  };
                }
                return { ...prev, [field]: value as string };
              });
            }
          }}
        />
        <Box sx={{ pr: 5 }}>
          <Divider />
          <Box
            alignItems="center"
            display="flex"
            justifyContent="flex-end"
            mt={2}
          >
            <Box>
              <Button
                onClick={() => {
                  onClose();
                  setJourneyInfo({});
                }}
                sx={{ mr: 2 }}
                variant="text"
              >
                <Msg id={messageIds.createJourney.cancel} />
              </Button>
              <Button
                disabled={
                  journeyInfo.title === undefined ||
                  journeyInfo.plural_label === undefined ||
                  journeyInfo.singular_label === undefined
                }
                onClick={async (e) => {
                  const journey = await createJourney(journeyInfo);
                  if (onSubmit) {
                    onSubmit(e, journey);
                  }
                  onClose();
                  setJourneyInfo({});
                }}
                variant="contained"
              >
                {submitLabel ?? (
                  <Msg id={messageIds.createJourney.submitLabel} />
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ZUICreateJourney;
