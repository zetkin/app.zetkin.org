import { Edit } from '@material-ui/icons';
import { useIntl } from 'react-intl';
import {
  Box,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginLeft: 72,
  },
  editButton: {
    '& span': {
      fontWeight: 'bold',
    },
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
}));

const PersonCard: React.FunctionComponent<{ titleId: string }> = ({
  titleId,
  children,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const title = intl.formatMessage({ id: titleId });

  return (
    <Box display="flex" flexDirection="column">
      <Typography className={classes.title} color="secondary" variant="h6">
        {title}
      </Typography>
      <Card>
        {children}
        <List disablePadding>
          <ListItem button disabled>
            <ListItemIcon>
              <Edit color="primary" />
            </ListItemIcon>
            <ListItemText
              className={classes.editButton}
              primary={intl.formatMessage(
                {
                  id: 'pages.people.person.editButton',
                },
                { title }
              )}
            />
          </ListItem>
        </List>
      </Card>
    </Box>
  );
};

export default PersonCard;
