import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';

import usePersonMutations from '../hooks/usePersonMutations';
import { ZetkinPerson } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIButton from 'zui/components/ZUIButton';
import ZUISection from 'zui/components/ZUISection';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUIText from 'zui/components/ZUIText';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useOrganization from 'features/organizations/hooks/useOrganization';

const PersonDeleteCard: React.FunctionComponent<{
  orgId: number;
  person: ZetkinPerson;
}> = ({ orgId, person }) => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { deletePerson } = usePersonMutations(orgId, person.id);

  const orgTitle = useOrganization(orgId).data?.title;
  if (!orgTitle) {
    return null;
  }

  const handleDelete = () => {
    showConfirmDialog({
      onSubmit: async () => {
        try {
          await deletePerson();
          router.push(`/organize/${orgId}/people`);
        } catch (err) {
          showSnackbar('error');
        }
      },
      warningText: messages.delete.confirm({
        name: person.first_name + ' ' + person.last_name,
        org: orgTitle,
      }),
    });
  };

  return (
    <ZUISection
      renderContent={() => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ZUIText color="secondary">{messages.delete.warning()}</ZUIText>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ZUIButton
              label={messages.delete.button()}
              onClick={handleDelete}
              variant="destructive"
            />
          </Box>
        </Box>
      )}
      title={messages.delete.title()}
    />
  );
};

export default PersonDeleteCard;
