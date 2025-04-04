import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';

type Props = {
  onClickShow: () => void;
  subOrgEvents: ZetkinEvent[];
};

const SubOrgEventBlurb: FC<Props> = ({ onClickShow, subOrgEvents }) => {
  const numEvents = subOrgEvents.length;
  const numOrgs = new Set(subOrgEvents.map((event) => event.organization.id))
    .size;

  return (
    <Box
      sx={(theme) => ({
        alignItems: 'center',
        bgcolor: theme.palette.grey[200],
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        my: 4,
        p: 2,
      })}
    >
      <Typography variant="h5">
        <Msg id={messageIds.subOrgEventBlurb.headline} />
      </Typography>
      <Typography>
        <Msg
          id={messageIds.subOrgEventBlurb.description}
          values={{
            eventsElem: <strong>{numEvents}</strong>,
            numEvents,
            numOrgs,
            orgsElem: <strong>{numOrgs}</strong>,
          }}
        />
      </Typography>
      <Button onClick={() => onClickShow()} variant="outlined">
        <Msg id={messageIds.subOrgEventBlurb.showButton} />
      </Button>
    </Box>
  );
};

export default SubOrgEventBlurb;
