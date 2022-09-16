import { NewReleases } from '@material-ui/icons';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import PersonCard from './PersonCard';
import { PersonPageProps } from 'pages/organize/[orgId]/people/[personId]';
import { personResource } from 'features/profile/api/people';
import { ZetkinPerson } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

const PersonDeleteCard: React.FunctionComponent<{
  orgId: PersonPageProps['orgId'];
  person: ZetkinPerson;
}> = ({ orgId, person }) => {
  const intl = useIntl();
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
      warningText: intl.formatMessage(
        { id: 'pages.people.person.delete.confirm' },
        { name: person.first_name + ' ' + person.last_name }
      ),
    });
  };

  return (
    <PersonCard titleId="pages.people.person.delete.title">
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
            <FormattedMessage id="pages.people.person.delete.warning" />
          </Typography>
        </Box>
        <Button
          color="primary"
          fullWidth
          onClick={deletePerson}
          variant="contained"
        >
          <FormattedMessage id="pages.people.person.delete.button" />
        </Button>
      </Box>
    </PersonCard>
  );
};

export default PersonDeleteCard;
