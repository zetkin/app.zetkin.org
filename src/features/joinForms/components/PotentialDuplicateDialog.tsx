import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { PotentialDuplicate } from '../rpc/getPotentialDuplicates';
import { useMessages } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

type Props = {
  onClose: () => void;
  onSubmit: () => void;
  orgId: number;
  potentialDuplicate: PotentialDuplicate | null;
};

const PotentialDuplicateDialog: FC<Props> = ({
  onClose,
  onSubmit,
  orgId,
  potentialDuplicate,
}) => {
  const messages = useMessages(messageIds);
  const count = potentialDuplicate?.duplicates.length ?? 0;

  return (
    <ZUIDialog
      onClose={onClose}
      open={!!potentialDuplicate}
      title={messages.submissionList.potentialDuplicate()}
    >
      <Typography variant="body1">
        {messages.submissionList.potentialDuplicateWarning({ count })}
      </Typography>
      {potentialDuplicate && (
        <>
          <Typography mt={2} variant="h6">
            {messages.submissionList.potentialDuplicateSubmission()}
          </Typography>
          <PersonInfo person={potentialDuplicate.submission.person_data} />
          <Typography mt={2} variant="h6">
            {messages.submissionList.potentialDuplicateExisting({ count })}
          </Typography>
          {potentialDuplicate.duplicates.map((person) => (
            <PersonInfo key={person.id} orgId={orgId} person={person} />
          ))}
        </>
      )}
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmit();
        }}
      >
        <ZUISubmitCancelButtons
          onCancel={onClose}
          submitText={messages.submissionList.approveButton()}
        />
      </form>
    </ZUIDialog>
  );
};

const PersonInfo: FC<{ orgId?: number; person: ZetkinPerson }> = ({
  orgId,
  person,
}) => {
  return (
    <Box alignItems="center" display="flex" gap={2} my={1}>
      {orgId && <ZUIPersonAvatar orgId={orgId} personId={person.id} />}
      <Box>
        <Typography fontWeight="bold">
          {`${person.first_name} ${person.last_name}`}
        </Typography>
        {person.email && (
          <Typography color="text.secondary" variant="body2">
            {person.email}
          </Typography>
        )}
        {person.phone && (
          <Typography color="text.secondary" variant="body2">
            {person.phone}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PotentialDuplicateDialog;
