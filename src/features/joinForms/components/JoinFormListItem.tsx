import { useContext } from 'react';
import { FormatListBulleted, OpenInNew } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import { Box, Button, Typography } from '@mui/material';

import { ZetkinJoinForm } from '../types';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { useApiClient } from 'core/hooks';
import getJoinFormEmbedData from '../rpc/getJoinFormEmbedData';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import useJoinFormMutations from '../hooks/useJoinFormMutations';

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.0em 0.5em',
  },
  endNumber: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    width: '7em',
  },
  icon: {
    color: theme.palette.grey[500],
    fontSize: '28px',
  },
  left: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 0',
    gap: '1em',
  },
  right: {
    alignItems: 'center',
    display: 'flex',
  },
}));

export enum STATUS_COLORS {
  BLUE = 'blue',
  GREEN = 'green',
  GREY = 'grey',
  ORANGE = 'orange',
  RED = 'red',
}

type Props = {
  form: ZetkinJoinForm;
  onClick: () => void;
};

const JoinFormListItem = ({ form, onClick }: Props) => {
  const classes = useStyles();
  const apiClient = useApiClient();
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { deleteForm } = useJoinFormMutations(form.organization.id, form.id);
  const messages = useMessages(messageIds);
  async function handleDeleteJoinForm() {
    await deleteForm();
    showSnackbar(
      'success',
      <Msg
        id={messageIds.deleteJoinForm.success}
        values={{ title: form.title }}
      />
    );
  }

  return (
    <Box
      className={classes.container}
      onClick={() => {
        onClick();
      }}
    >
      <Box className={classes.left}>
        <FormatListBulleted className={classes.icon} />
        <Box alignItems="center" display="flex" gap={1}>
          <Typography>{form.title}</Typography>
          <Typography color="secondary">(#{form.id})</Typography>
        </Box>
      </Box>
      <Box>
        <Box className={classes.endNumber}>
          {/* TODO: Add stats
            <ZUIIconLabel
              icon={<SecondaryIcon color={endNumberColor} />}
              label={endNumber.toString()}
            />
          */}
        </Box>
      </Box>
      <Box>
        <ZUIEllipsisMenu
          items={[
            {
              label: messages.embedding.copyLink(),
              onSelect: async (ev) => {
                ev.stopPropagation();
                const data = await apiClient.rpc(getJoinFormEmbedData, {
                  formId: form.id,
                  orgId: form.organization.id,
                });

                const url = `${location.protocol}//${location.host}/o/${form.organization.id}/embedjoinform/${data.data}`;
                navigator.clipboard.writeText(url);

                showSnackbar(
                  'success',
                  <>
                    <Msg id={messageIds.embedding.linkCopied} />
                    <Button
                      endIcon={<OpenInNew />}
                      href={url}
                      size="small"
                      sx={{
                        mx: 1,
                      }}
                      target="_blank"
                    >
                      <Msg id={messageIds.embedding.openLink} />
                    </Button>
                  </>
                );
              },
            },
            {
              label: messages.submitToken.copySubmitToken(),
              onSelect: async (ev) => {
                ev.stopPropagation();

                navigator.clipboard.writeText(form.submit_token);

                showSnackbar(
                  'success',
                  <Msg id={messageIds.submitToken.submitTokenCopied} />
                );
              },
            },
            {
              label: messages.embedding.delete(),
              onSelect: async (ev) => {
                ev.stopPropagation();
                showConfirmDialog({
                  onSubmit: handleDeleteJoinForm,
                  title: messages.deleteJoinForm.title(),
                  warningText: messages.deleteJoinForm.warning({
                    title: form.title,
                  }),
                });
              },
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default JoinFormListItem;
