import { Box } from '@mui/material';
import { FC, useState } from 'react';
import { Explore } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';
import ZUICreateJourney from 'zui/ZUICreateJourney';
import zuiMessageIds from 'zui/l10n/messageIds';

const JourneyActionButton: FC = () => {
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);
  const [createJourneyOpen, setCreateJourneyOpen] = useState(false);

  return (
    <Box>
      <ZUIButtonMenu
        items={[
          {
            icon: <Explore />,
            label: messages.actions.createJourney(),
            onClick: () => {
              setCreateJourneyOpen(true);
            },
          },
        ]}
        label={messages.actions.create()}
      />
      <ZUICreateJourney
        onClose={() => setCreateJourneyOpen(false)}
        open={createJourneyOpen}
        submitLabel={zuiMessages.createJourney.submitLabel()}
        title={zuiMessages.createJourney.title()}
      />
    </Box>
  );
};

export default JourneyActionButton;
