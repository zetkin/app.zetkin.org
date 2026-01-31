import { ArrowForward } from '@mui/icons-material';
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
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';

const SurveyLinkDialog = ({
  email,
  onClose,
  onKeepEmail,
  onUpdateEmail,
  open,
  person,
}: {
  email: string;
  onClose: () => void;
  onKeepEmail: () => void;
  onUpdateEmail: (email: string) => void;
  open: boolean;
  person: ZetkinPerson;
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  if (person.email && email !== person.email) {
    return (
      <Dialog onClose={onClose} open={open}>
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

          <Box alignItems="center" display="flex" flexWrap="wrap" mb={2}>
            {email}
            <Box alignItems="center" display="flex" ml={2} mr={2}>
              <ArrowForward
                color="secondary"
                sx={{
                  opacity: '50%',
                }}
              />
            </Box>
            {person.email}
          </Box>
          {messages.surveyDialogDifferentEmail.description()}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 18px' }}>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Button
              onClick={() => {
                onClose();
              }}
            >
              {messages.surveyDialog.cancelLinking()}
            </Button>
          </Box>
          <Button
            onClick={() => {
              onKeepEmail();
              onClose();
            }}
          >
            {messages.surveyDialogDifferentEmail.keep()}
          </Button>
          <Button
            onClick={() => {
              onUpdateEmail(email);
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
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{messages.surveyDialog.title()}</DialogTitle>
      <Divider />
      <DialogContent>
        <Box alignItems="center" display="flex" mb={2}>
          {email}
          <Box alignItems="center" display="flex" ml={2} mr={2}>
            <ArrowForward
              color="secondary"
              sx={{
                opacity: '50%',
              }}
            />
          </Box>
          <ZUIPersonAvatar orgId={orgId} personId={person?.id ?? 0} size="sm" />
          <Typography ml={2} variant="h6">
            {person?.first_name} {person?.last_name}
          </Typography>
        </Box>
        {messages.surveyDialog.description()}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 18px' }}>
        <Button onClick={onClose} variant="outlined">
          {messages.surveyDialog.doNotAdd()}
        </Button>
        <Button
          onClick={() => {
            onUpdateEmail(email);
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
