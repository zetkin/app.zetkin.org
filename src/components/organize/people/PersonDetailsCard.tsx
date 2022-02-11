import { FormattedMessage } from 'react-intl';
import {
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Edit, LocationCity, Mail, Phone } from '@material-ui/icons';

import { ZetkinPerson } from 'types/zetkin';

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

const PersonDetailsCard: React.FunctionComponent<ZetkinPerson> = (person) => {
  const classes = useStyles();
  const details = [
    { icon: <Phone />, value: person.phone },
    { icon: <Mail />, value: person.email },
    {
      icon: <LocationCity />,
      value: [person.street_address, person.city]
        .filter((item) => !!item)
        .join(', '),
    },
  ].filter((detail) => !!detail.value);

  return (
    <Box display="flex" flexDirection="column">
      <Typography className={classes.title} color="secondary" variant="h6">
        <FormattedMessage id="pages.people.person.details.title" />
      </Typography>
      <Card>
        <List disablePadding>
          {details.map((detail, idx) => (
            <div key={idx}>
              <ListItem button>
                <ListItemIcon>{detail.icon}</ListItemIcon>
                <ListItemText primary={detail.value} />
              </ListItem>
              <Divider className={classes.divider} />
            </div>
          ))}
          <ListItem button disabled>
            <ListItemIcon>
              <Edit color="primary" />
            </ListItemIcon>
            <ListItemText
              className={classes.editButton}
              primary="Edit details"
            />
          </ListItem>
        </List>
      </Card>
    </Box>
  );
};

export default PersonDetailsCard;
