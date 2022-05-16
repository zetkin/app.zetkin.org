import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormattedMessage } from 'react-intl';
import { Box, Button, Fade, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstance } from 'types/updates';

interface Props {
  update: ZetkinUpdateJourneyInstance;
}

const TimelineJourneyInstance: React.FunctionComponent<Props> = ({
  update,
}) => {
  const fieldToUpdate = Object.keys(update.details.changes)[0] as
    | 'summary'
    | 'title';
  const [expandSummary, setExpandSummary] = useState<boolean>(false);
  const [currentScroll, setCurrentScroll] = useState<number>(0);

  useEffect(() => {
    if (expandSummary) {
      setCurrentScroll(window.scrollY);
      window.addEventListener('scroll', closeOnScroll);
    } else {
      window.removeEventListener('scroll', closeOnScroll);
    }
  }, [expandSummary]);

  useEffect(() => {
    return () => window.removeEventListener('scroll', closeOnScroll);
  }, []);

  return (
    <UpdateContainer headerContent={renderDescriptionText()} update={update}>
      {renderContent()}
    </UpdateContainer>
  );

  function renderDescriptionText() {
    return (
      <FormattedMessage
        id={`misc.updates.${update.type}.${fieldToUpdate}`}
        values={{
          actor: <ZetkinPersonLink person={update.actor} />,
        }}
      />
    );
  }

  function renderContent() {
    return (
      <Box>
        <Typography
          style={{
            maxHeight: expandSummary ? 1000 : 100,
            overflowY: 'hidden',
            transition: 'max-height 500ms ease',
          }}
          variant="body1"
        >
          {update.details.changes[fieldToUpdate]?.to}
        </Typography>
        {fieldToUpdate === 'summary' && (
          <Fade in={!expandSummary}>
            <Button
              color="primary"
              onClick={() => setExpandSummary(!expandSummary)}
              startIcon={<ExpandMoreIcon />}
              variant="text"
            >
              Read more
            </Button>
          </Fade>
        )}
      </Box>
    );
  }

  function closeOnScroll() {
    if (Math.abs(window.scrollY - currentScroll) > window.innerHeight / 3) {
      setExpandSummary(false);
      window.removeEventListener('scroll', closeOnScroll);
    }
  }
};

export default TimelineJourneyInstance;
