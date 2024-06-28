import { Box, Card, CardContent, Typography } from '@mui/material';

import { Msg } from 'core/i18n';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';

const JourneyInstanceOutcome = ({
  journeyInstance,
}: {
  journeyInstance: ZetkinJourneyInstance;
}): JSX.Element => {
  return (
    <Card>
      <CardContent>
        <Box p={1.5}>
          <Typography gutterBottom variant="h5">
            <Msg
              id={messageIds.instance.sections.outcome}
              values={{
                journeyTitle:
                  journeyInstance.journey.singular_label.toLowerCase(),
              }}
            />
          </Typography>
          <Typography>
            {journeyInstance.outcome ? (
              journeyInstance.outcome
            ) : (
              <Msg id={messageIds.instance.noOutcomeDetails} />
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JourneyInstanceOutcome;
