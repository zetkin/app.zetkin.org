import { useContext } from 'react';
import { FormatListBulleted, OpenInNew } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import { Box, Button, Theme, Typography } from '@mui/material';

import theme from 'theme';
import { ZetkinJoinForm } from '../types';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { useApiClient } from 'core/hooks';
import getJoinFormEmbedData from '../rpc/getJoinFormEmbedData';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

const useStyles = makeStyles<Theme>((theme) => ({
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
  GRAY = 'gray',
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
  const messages = useMessages(messageIds);

  return (
    <Box
      className={classes.container}
      onClick={() => {
        onClick();
      }}
    >
      <Box className={classes.left}>
        <FormatListBulleted className={classes.icon} />
        <Box>
          <Typography color={theme.palette.text.primary}>
            {form.title}
          </Typography>
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
          ]}
        />
      </Box>
    </Box>
  );
};

export default JoinFormListItem;
