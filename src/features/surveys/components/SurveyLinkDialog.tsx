import { ArrowDownward } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import usePersonMutations from 'features/profile/hooks/usePersonMutations';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';

const SurveyLinkDialog = ({
  email,
  onClose,
  open,
  person,
}: {
  email: string;
  onClose: () => void;
  open: boolean;
  person: ZetkinPerson;
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { updatePerson } = usePersonMutations(orgId, person.id);

  if (person.email && email !== person.email) {
    return (
      <Dialog open={open}>
        <DialogTitle>{messages.surveyDialogDifferentEmail.title()}</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="row"
            paddingBottom="5px"
          >
            <ZUIPersonAvatar
              orgId={orgId}
              personId={person?.id ?? 0}
              size="sm"
            />
            <Typography ml={2} variant="h6">
              {person?.first_name} {person?.last_name}
            </Typography>
          </Box>

          <Box
            mb={2}
            sx={{
              alignItems: 'start',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {email}
            <ArrowDownward
              color="secondary"
              sx={{
                opacity: '50%',
              }}
            />
            {person.email}
          </Box>
          {messages.surveyDialogDifferentEmail.description()}
        </DialogContent>
        <DialogActions sx={{ padding: '20px 24px' }}>
          <Button onClick={onClose}>
            {messages.surveyDialogDifferentEmail.keep()}
          </Button>
          <Button
            onClick={() => {
              updatePerson({ email });
              onClose();
            }}
            variant="contained"
          >
            {messages.surveyDialogDifferentEmail.update()}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open}>
      <DialogTitle>{messages.surveyDialog.title()}</DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          mb={2}
          sx={{
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {email}
          <ArrowDownward
            color="secondary"
            sx={{
              opacity: '50%',
            }}
          />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <ZUIPersonAvatar
              orgId={orgId}
              personId={person?.id ?? 0}
              size="sm"
            />
            <Typography ml={2} variant="h6">
              {person?.first_name} {person?.last_name}
            </Typography>
          </Box>
        </Box>
        {messages.surveyDialog.description()}
      </DialogContent>
      <DialogActions sx={{ padding: '20px 24px' }}>
        <Button onClick={onClose} variant="outlined">
          {messages.surveyDialog.cancel()}
        </Button>
        <Button
          onClick={() => {
            updatePerson({ email });
            onClose();
          }}
          variant="contained"
        >
          {messages.surveyDialog.add()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SurveyLinkDialog;
