import { Chip } from '@mui/material';
import { useIntl } from 'react-intl';

import makeStyles from '@mui/styles/makeStyles';

import { ZetkinJourneyInstance } from 'utils/types/zetkin';

const useStyles = makeStyles((theme) => ({
  closedChip: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
    fontWeight: 'bold',
  },
  openChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    fontWeight: 'bold',
  },
}));

interface JourneyStatusChipProps {
  instance: Pick<ZetkinJourneyInstance, 'closed'>;
}

const JourneyStatusChip: React.FC<JourneyStatusChipProps> = ({ instance }) => {
  const intl = useIntl();
  const classes = useStyles();
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
