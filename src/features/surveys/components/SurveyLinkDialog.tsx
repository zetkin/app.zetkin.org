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

  return (
    <Dialog open={open}>
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
      <DialogActions>
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
