import React, { useContext, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowForward, ContentCopy, Delete, Send } from '@mui/icons-material';
import router from 'next/router';

import CancelButton from './CancelButton';
import DeliveryButton from './DeliveryButton';
import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import useDuplicateEmail from '../hooks/useDuplicateEmail';
import useEmail from '../hooks/useEmail';
import { ZetkinEmail } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';
import ChangeCampaignDialog from '../../campaigns/components/ChangeCampaignDialog';
import notEmpty from 'utils/notEmpty';

interface EmailActionButtonsProp {
  email: ZetkinEmail;
  orgId: number;
  state: EmailState;
}

const EmailActionButtons = ({
  email,
  orgId,
  state,
}: EmailActionButtonsProp) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { deleteEmail, updateEmail } = useEmail(orgId, email.id);
  const { duplicateEmail } = useDuplicateEmail(orgId, email.id);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  function handleMove() {
    setIsMoveDialogOpen(true);
  }

  const handleOnCampaignSelected = async (campaignId: number) => {
    const updatedEmail = await updateEmail({ campaign_id: campaignId });
    await router.push(
      `/organize/${orgId}/projects/${campaignId}/emails/${email.id}`
    );
    showSnackbar(
      'success',
      messages.emailChangeCampaignDialog.success({
        campaignTitle: updatedEmail.campaign!.title,
        emailTitle: email.title!,
      })
    );
  };

  return (
    <Box display="flex">
      {state === EmailState.SCHEDULED && (
        <CancelButton onClick={() => updateEmail({ published: null })} />
      )}
      {state === EmailState.DRAFT && <DeliveryButton email={email} />}
      {email.published &&
        state === EmailState.SENT &&
        notEmpty(email.processed) && (
          <Box alignItems="center" display="flex">
            <Send color="secondary" sx={{ mr: 1 }} />
            <Typography color="secondary">
              <Msg
                id={messageIds.deliveryStatus.wasSent}
                values={{
                  datetime: (
                    <ZUIDateTime convertToLocal datetime={email.published} />
                  ),
                }}
              />
            </Typography>
          </Box>
        )}
      {email.published &&
        state === EmailState.SENT &&
        email.processed === null && (
          <Box alignItems="center" display="flex">
            <Send color="secondary" sx={{ mr: 1 }} />
            <Typography color="secondary">
              <Msg id={messageIds.deliveryStatus.notProcessed} />
            </Typography>
          </Box>
        )}
      <ZUIEllipsisMenu
        items={[
          {
            label: <>{messages.emailActionButtons.move()}</>,
            onSelect: () => handleMove(),
            startIcon: <ArrowForward />,
          },
          {
            label: <>{messages.emailActionButtons.duplicate()}</>,
            onSelect: () => duplicateEmail(),
            startIcon: <ContentCopy />,
          },
          {
            label: <>{messages.emailActionButtons.delete()}</>,
            onSelect: () => {
              showConfirmDialog({
                onSubmit: deleteEmail,
                title: messages.emailActionButtons.delete(),
                warningText: messages.emailActionButtons.warning(),
              });
            },
            startIcon: <Delete />,
          },
        ]}
      />
      <ChangeCampaignDialog
        errorMessage={messages.emailChangeCampaignDialog.error()}
        onCampaignSelected={handleOnCampaignSelected}
        onClose={() => setIsMoveDialogOpen(false)}
        open={isMoveDialogOpen}
        title={messages.emailChangeCampaignDialog.title()}
      />
    </Box>
  );
};
export default EmailActionButtons;
