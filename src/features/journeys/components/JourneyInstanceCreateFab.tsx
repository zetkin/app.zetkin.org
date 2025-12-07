import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import oldTheme from 'theme';

const JourneyInstanceCreateFab: React.FunctionComponent = () => {
  const { orgId, journeyId } = useRouter().query;

  return (
    <Link
      href={`/organize/${orgId}/journeys/${journeyId}/new`}
      legacyBehavior
      passHref
    >
      <Fab
        color="primary"
        data-testid="JourneyInstanceOverviewPage-addFab"
        sx={{
          bottom: oldTheme.spacing(10),
          position: 'fixed',
          right: oldTheme.spacing(4),
        }}
      >
        <Add />
      </Fab>
    </Link>
  );
};

export default JourneyInstanceCreateFab;
