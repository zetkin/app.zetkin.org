import { FormattedMessage } from 'react-intl';
import { ReactEventHandler } from 'react';
import { Fade, Grid, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

import ZetkinCard from 'components/ZetkinCard';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinView } from 'types/zetkin';

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
    <Fade in>
      <ZetkinCard onClick={onClick} value={view.id}>
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
              <ZetkinRelativeTime datetime={view.created} />
            </Typography>
          </Grid>
        </Grid>
      </ZetkinCard>
    </Fade>
  );
};

export default ViewCard;
