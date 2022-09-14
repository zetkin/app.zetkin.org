import { Add } from '@material-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fab, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  fab: {
    bottom: theme.spacing(10),
    position: 'fixed',
    right: theme.spacing(4),
  },
}));

const JourneyInstanceCreateFab: React.FunctionComponent = () => {
  const classes = useStyles();
  const { orgId, journeyId } = useRouter().query;

  return (
    <Link href={`/organize/${orgId}/journeys/${journeyId}/new`} passHref>
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
