import { FormattedMessage } from 'react-intl';
import makeStyles from '@mui/styles/makeStyles';
import { ReactEventHandler } from 'react';
import { Theme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

import ClickableCard from './ClickableCard';
import { ZetkinView } from 'utils/types/zetkin';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

const useStyles = makeStyles((theme: Theme) => ({
  action: {
    padding: theme.spacing(2),
  },
  content: {
    minHeight: 200,
  },
}));

interface ViewCardProps {
  onClick: ReactEventHandler;
  view: ZetkinView;
}

const ViewCard: React.FunctionComponent<ViewCardProps> = ({
  onClick,
  view,
}) => {
  const classes = useStyles();

  return (
    <ClickableCard onClick={onClick} value={view.id}>
      <Grid
        className={classes.content}
        container
        direction="column"
        justifyContent="space-between"
      >
        <Grid item>
          <Typography variant="h5">{view.title}</Typography>
          <Typography variant="body2">{view.description}</Typography>
        </Grid>
        <Grid item>
          <Typography component="p" variant="caption">
            <FormattedMessage
              id="misc.views.suggested.created"
              values={{ name: view.owner.name }}
            />
          </Typography>
          <Typography component="p" variant="caption">
            <ZUIRelativeTime datetime={view.created} />
          </Typography>
        </Grid>
      </Grid>
    </ClickableCard>
  );
};

export default ViewCard;
