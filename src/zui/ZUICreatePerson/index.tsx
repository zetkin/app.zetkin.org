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

import checkInvalidFields from './checkInvalidFields';
import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';
import PersonalInfoForm from './PersonalInfoForm';
import useCreatePerson from 'features/profile/hooks/useCreatePerson';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCreatePerson, ZetkinPerson } from 'utils/types/zetkin';

interface ZUICreatePersonProps {
  onClose: () => void;
  onSubmit?: (e: MouseEvent<HTMLButtonElement>, person: ZetkinPerson) => void;
  open: boolean;
  title?: string;
  submitLabel?: string;
}

const ZUICreatePerson: FC<ZUICreatePersonProps> = ({
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
  const createPerson = useCreatePerson(orgId);

  const [tags, setTags] = useState<number[]>([]);

  const [personalInfo, setPersonalInfo] = useState<ZetkinCreatePerson>({});

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        onClose();
        setPersonalInfo({});
        setTags([]);
      }}
      open={open}
    >
      <Box sx={{ padding: '40px 0 40px 40px' }}>
        <Box display="flex">
          <Typography sx={{ ml: 0.5 }} variant="h5">
            {title}
          </Typography>
        </Box>
        {!customFields ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', m: 8, pr: '40px' }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <PersonalInfoForm
            onChange={(field, value) => {
              if (value === '') {
                const copied = { ...personalInfo };
                delete copied[field];
                setPersonalInfo(copied);
              } else {
                if (field === 'tags' && value) {
                  setTags((prev) =>
                    tags.includes(value as number)
                      ? tags.filter((item) => item !== value)
                      : [...prev, value as number]
                  );
                } else {
                  setPersonalInfo((prev) => {
                    return { ...prev, [field]: value as string };
                  });
                }
              }
            }}
            personalInfo={personalInfo}
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
                  setPersonalInfo({});
                  setTags([]);
                }}
                sx={{ mr: 2 }}
                variant="text"
              >
                <Msg id={messageIds.createPerson.cancel} />
              </Button>
              <Button
                disabled={
                  personalInfo.first_name === undefined ||
                  personalInfo.last_name === undefined ||
                  checkInvalidFields(customFields || [], personalInfo)
                    .length !== 0
                }
                onClick={async (e) => {
                  const person = await createPerson(personalInfo, tags);
                  if (onSubmit) {
                    onSubmit(e, person);
                  }
                  onClose();
                  setPersonalInfo({});
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

export default ZUICreatePerson;
