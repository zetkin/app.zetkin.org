import {
  Box,
  Button,
  CircularProgress,
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
import useCreatePerson from 'features/profile/hooks/useCreatePerson';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCreateJourney, ZetkinPerson } from 'utils/types/zetkin';
import zuiMessages from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { TagToBeAdded } from 'features/profile/types';

interface ZUICreateJourneyProps {
  initialValues?: ZetkinCreateJourney;
  onClose: () => void;
  onSubmit?: (e: MouseEvent<HTMLButtonElement>, journey: ZetkinPerson) => void;
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
  const customFields = useCustomFields(orgId).data;
  const createJourney = useCreatePerson(orgId);
  const [tags, setTags] = useState<TagToBeAdded[]>([]);

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
        setTags([]);
      }}
      open={open}
    >
      <Box sx={{ padding: '40px 0 40px 40px' }}>
        <Box display="flex">
          <Typography sx={{ ml: 0.5 }} variant="h5">
            {title ?? messages.createPerson.title.default()}
          </Typography>
        </Box>

        {!customFields ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', m: 8, pr: '40px' }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <JourneyInfoForm
            journeyInfo={journeyInfo}
            onChange={(field, value) => {
              if (value === '') {
                const copied = { ...journeyInfo };
                delete copied[field];
                setJourneyInfo(copied);
              } else {
                if (field === 'tags' && value && typeof value !== 'string') {
                  const tag = value;
                  setTags((prev) =>
                    tags.find((item) => item.id === tag.id)
                      ? tags.filter((item) => item.id !== tag.id)
                      : [...prev, tag]
                  );
                } else {
                  setJourneyInfo((prev) => {
                    return { ...prev, [field]: value as string };
                  });
                }
              }
            }}
            tags={tags}
          />
        )}
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
                  setTags([]);
                }}
                sx={{ mr: 2 }}
                variant="text"
              >
                <Msg id={messageIds.createPerson.cancel} />
              </Button>
              <Button
                disabled={journeyInfo.name === undefined}
                onClick={async (e) => {
                  const journey = await createJourney(journeyInfo, tags);
                  if (onSubmit) {
                    onSubmit(e, journey);
                  }
                  onClose();
                  setJourneyInfo({});
                  setTags([]);
                }}
                variant="contained"
              >
                {submitLabel ?? (
                  <Msg id={messageIds.createPerson.submitLabel.default} />
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
