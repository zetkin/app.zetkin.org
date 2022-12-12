import { FormattedMessage as Msg } from 'react-intl';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { ZetkinJourneyInstance } from 'utils/types/zetkin';

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
              id="pages.organizeJourneyInstance.sections.outcome"
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
              <Msg id="pages.organizeJourneyInstance.noOutcomeDetails" />
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JourneyInstanceOutcome;
