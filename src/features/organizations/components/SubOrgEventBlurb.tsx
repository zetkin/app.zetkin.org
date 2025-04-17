import { Box } from '@mui/material';
import { FC } from 'react';

import { Msg, useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';

type Props = {
  onClickShow: () => void;
  subOrgEvents: ZetkinEvent[];
};

const SubOrgEventBlurb: FC<Props> = ({ onClickShow, subOrgEvents }) => {
  const messages = useMessages(messageIds);
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
      <ZUIText variant="headingMd">
        <Msg id={messageIds.subOrgEventBlurb.headline} />
      </ZUIText>
      <ZUIText>
        <Msg
          id={messageIds.subOrgEventBlurb.description}
          values={{
            eventsElem: <strong>{numEvents}</strong>,
            numEvents,
            numOrgs,
            orgsElem: <strong>{numOrgs}</strong>,
          }}
        />
      </ZUIText>
      <ZUIButton
        label={messages.subOrgEventBlurb.showButton()}
        onClick={() => onClickShow()}
        size="large"
        variant="secondary"
      />
    </Box>
  );
};

export default SubOrgEventBlurb;
