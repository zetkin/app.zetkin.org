import { ArrowForward } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import usePersonMutations from 'features/profile/hooks/usePersonMutations';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';

const SurveyDialogLink = ({
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
      <DialogContent>
        <Box alignItems="center" display="flex">
          {email}
          <Box alignItems="center" display="flex" ml={2} mr={2}>
            <ArrowForward />
          </Box>
          <ZUIPersonAvatar orgId={orgId} personId={person?.id ?? 0} />
          <Typography ml={2} variant="h6">
            {person?.first_name} {person?.last_name}
          </Typography>
        </Box>
        {messages.surveyDialog.description()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{messages.surveyDialog.cancel()}</Button>
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

export default SurveyDialogLink;
