import { useIntl } from 'react-intl';
import { Chip, makeStyles, Theme } from '@material-ui/core';

import { ZetkinJourneyInstance } from 'types/zetkin';

const useStyles = makeStyles<Theme, { spacing?: boolean }>((theme) => ({
  closedChip: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
    fontWeight: 'bold',
    marginRight: ({ spacing }) => (spacing ? '1rem' : 0),
  },
  openChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    fontWeight: 'bold',
    marginRight: ({ spacing }) => (spacing ? '1rem' : 0),
  },
}));

interface JourneyStatusChipProps {
  instance: Pick<ZetkinJourneyInstance, 'closed'>;
  spacing?: boolean;
}

const JourneyStatusChip: React.FC<JourneyStatusChipProps> = ({
  instance,
  spacing = true,
}) => {
  const intl = useIntl();
  const classes = useStyles({ spacing });
  return !instance.closed ? (
    <Chip
      className={classes.openChip}
      label={intl.formatMessage({
        id: 'layout.organize.journeys.statusOpen',
      })}
    />
  ) : (
    <Chip
      className={classes.closedChip}
      label={intl.formatMessage({
        id: 'layout.organize.journeys.statusClosed',
      })}
    />
  );
};

export default JourneyStatusChip;
