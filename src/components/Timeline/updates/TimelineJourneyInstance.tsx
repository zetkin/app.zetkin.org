import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Box, Button, Fade, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import React, { useEffect, useRef, useState } from 'react';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstance } from 'types/updates';

interface Props {
  update: ZetkinUpdateJourneyInstance;
}

const TimelineJourneyInstance: React.FunctionComponent<Props> = ({
  update,
}) => {
  const intl = useIntl();
  const textRef = useRef<HTMLParagraphElement>();
  const fieldToUpdate = Object.keys(update.details.changes)[0] as
    | 'summary'
    | 'title';
  const [overflow, setOverflow] = useState<number>();
  const [expandSummary, setExpandSummary] = useState<boolean>(false);
  const [currentScroll, setCurrentScroll] = useState<number>(0);

  // Everyone wants to click a "show more" button,
  // No one wants to click a "show less" button. This way they don't have to:
  // Also roughly centers the content they've just asked to read
  useEffect(() => {
    if (expandSummary && !!textRef) {
      const offset = textRef?.current?.offsetTop as number;
      window.scrollTo({
        behavior: 'smooth',
        top: offset - 100,
      });
      setTimeout(() => {
        setCurrentScroll(offset - 100);
        window.addEventListener('scroll', closeOnScroll);
      }, 1000);
    } else {
      window.removeEventListener('scroll', closeOnScroll);
    }
  }, [expandSummary]);

  useEffect(() => {
    const text = textRef?.current;
    if (text && text.scrollHeight > text.clientHeight) {
      setOverflow(textRef.current?.scrollHeight);
    }
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
          innerRef={textRef}
          style={{
            maxHeight: expandSummary ? overflow : 100,
            overflowY: 'hidden',
            transition: 'max-height 300ms ease',
          }}
          variant="body1"
        >
          {update.details.changes[fieldToUpdate]?.to}
        </Typography>
        {fieldToUpdate.includes('summary') && (
          <Fade in={!!overflow && !expandSummary}>
            <Button
              color="primary"
              onClick={() => setExpandSummary(!expandSummary)}
              startIcon={<ExpandMoreIcon />}
              variant="text"
            >
              {intl.formatMessage({ id: 'misc.buttons.readMore' })}
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
