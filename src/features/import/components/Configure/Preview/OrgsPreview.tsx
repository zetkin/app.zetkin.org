import { makeStyles } from '@mui/styles';
import { Box, Stack, Theme } from '@mui/system';
import { Tooltip, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { ColumnKind, Sheet } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

interface OrgsPreviewProps {
  currentSheet: Sheet;
  theme: Theme;
  orgs: string[];
}

const useStyles = makeStyles((theme) => ({
  chip: {
    borderColor: theme.palette.grey[500],
    borderRadius: '1em',
    borderWidth: '1px',
    color: theme.palette.text.secondary,
    cursor: 'default',
    display: 'flex',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.1em 0.7em',
    textOverflow: 'ellipsis',
  },
}));

const OrgsPreview = ({ currentSheet, orgs, theme }: OrgsPreviewProps) => {
  const messages = useMessages(messageIds);
  const classes = useStyles();

  const hasMapped = currentSheet.columns.some(
    (column) =>
      column.kind === ColumnKind.ORGANIZATION && column.mapping.length > 0
  );
  const noOrgs = (
    <Typography
      sx={{
        color: theme.palette.grey[400],
        fontStyle: 'italic',
      }}
    >
      (<Msg id={messageIds.configuration.preview.noOrgs} />)
    </Typography>
  );

  const displayedOrgs = orgs?.slice(0, 3);
  const hiddenOrgs = orgs?.slice(3);
  const tooltipTitle = hiddenOrgs?.join(', ');
  return (
    <PreviewGrid
      columnHeader={messages.configuration.preview.columnHeader.org()}
      rowValue={
        hasMapped && orgs.length === 0 ? (
          noOrgs
        ) : (
          <Stack
            direction="row"
            maxWidth={'300px'}
            mt="5px"
            spacing={1}
            sx={{ textOverflow: 'ellipsis' }}
          >
            {displayedOrgs?.map((org, index) => (
              <Tooltip key={`preview-org-${index}`} title={org}>
                <Typography noWrap>{org}</Typography>
              </Tooltip>
            ))}
            {hiddenOrgs!.length > 0 && (
              <Tooltip title={tooltipTitle}>
                <Box border={2} className={classes.chip}>
                  {`${displayedOrgs!.length > 0 ? '+' : ''}${
                    hiddenOrgs?.length
                  }`}
                </Box>
              </Tooltip>
            )}
          </Stack>
        )
      }
      unmappedRow={!hasMapped}
    />
  );
};

export default OrgsPreview;
