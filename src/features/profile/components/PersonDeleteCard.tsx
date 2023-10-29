import { NewReleases } from '@mui/icons-material';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Typography } from '@mui/material';

import PersonCard from './PersonCard';
import { personResource } from 'features/profile/api/people';
import { ZetkinPerson } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

const PersonDeleteCard: React.FunctionComponent<{
  orgId: string;
  person: ZetkinPerson;
}> = ({ orgId, person }) => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const useRemoveMutation = personResource(
    orgId.toString(),
    person.id.toString()
  ).useRemove();

  const deletePerson = () => {
    showConfirmDialog({
      onSubmit: () =>
        useRemoveMutation.mutate(undefined, {
          onError: () => showSnackbar('error'),
          onSuccess: () => router.push(`/organize/${orgId}/people/views`),
        }),
      warningText: messages.delete.confirm({
        name: person.first_name + ' ' + person.last_name,
      }),
    });
  };

  return (
    <PersonCard title={messages.delete.title()}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minHeight={125}
        p={2}
      >
        <Box display="flex" flexDirection="row">
          <NewReleases color="primary" style={{ marginRight: 10 }} />
          <Typography color="primary" variant="h5">
            <Msg id={messageIds.delete.warning} />
          </Typography>
        </Box>
        <Button
          color="primary"
          fullWidth
          onClick={deletePerson}
          variant="contained"
        >
          <Msg id={messageIds.delete.button} />
        </Button>
      </Box>
    </PersonCard>
  );
};

export default PersonDeleteCard;
