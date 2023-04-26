import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import FaceRetouchingOffOutlinedIcon from '@mui/icons-material/FaceRetouchingOffOutlined';
import { FC } from 'react';
import { Box, Button } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';

import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';

interface EventContactCardProps {
  data: ZetkinEvent;
}

const EventContactCard: FC<EventContactCardProps> = ({ data }) => {
  const messages = useMessages(messageIds);

  return (
    <Box
      sx={{
        '& div': {
          flexDirection: 'column',
          flexWrap: 'wrap',
        },
        display: 'block',
      }}
    >
      <ZUICard
        header={
          <Box>
            {data.contact?.id ? (
              <>
                <FaceOutlinedIcon />
                {messages.eventContactCard.header()}
              </>
            ) : (
              <Box>
                <FaceRetouchingOffOutlinedIcon />
                {messages.eventContactCard.noContact()}
              </Box>
            )}
          </Box>
        }
        status={<Box></Box>}
      >
        <Button variant="text">
          {messages.eventContactCard.removeButton()}
        </Button>
      </ZUICard>
    </Box>
  );
};

export default EventContactCard;
