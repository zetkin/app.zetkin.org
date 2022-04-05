import { FormattedMessage as Msg } from 'react-intl';
import { useState } from 'react';
import { Button, Collapse, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import { ZetkinJourneyInstance } from 'types/zetkin';

const JourneyInstanceSummary = ({
  journeyInstance,
}: {
  journeyInstance: ZetkinJourneyInstance;
}): JSX.Element => {
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  return (
    <>
      {journeyInstance.summary.length < 100 ? (
        <Typography variant="body1">{journeyInstance.summary}</Typography>
      ) : (
        <>
          <Typography variant="body1">
            {journeyInstance.summary.substring(0, 200)}
            {!summaryExpanded && '...'}
          </Typography>
          <Collapse in={summaryExpanded}>
            <Typography variant="body1">
              {journeyInstance.summary.substring(200)}
            </Typography>
          </Collapse>
          <Button
            color="primary"
            onClick={() => setSummaryExpanded((prev) => !prev)}
            startIcon={summaryExpanded ? <ExpandLess /> : <ExpandMore />}
            style={{ textTransform: 'uppercase' }}
          >
            <Msg
              id={
                summaryExpanded
                  ? 'pages.organizeJourneyInstance.collapse'
                  : 'pages.organizeJourneyInstance.expand'
              }
            />
          </Button>
        </>
      )}
    </>
  );
};

export default JourneyInstanceSummary;
