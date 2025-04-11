import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import makeStyles from '@mui/styles/makeStyles';

import oldTheme from 'theme';

const useStyles = makeStyles(() => ({
  fab: {
    bottom: oldTheme.spacing(10),
    position: 'fixed',
    right: oldTheme.spacing(4),
  },
}));

const JourneyInstanceCreateFab: React.FunctionComponent = () => {
  const classes = useStyles();
  const { orgId, journeyId } = useRouter().query;

  return (
    <Link
      href={`/organize/${orgId}/journeys/${journeyId}/new`}
      legacyBehavior
      passHref
    >
      <Fab
        className={classes.fab}
        color="primary"
        data-testid="JourneyInstanceOverviewPage-addFab"
      >
        <Add />
      </Fab>
    </Link>
  );
};

export default JourneyInstanceCreateFab;
