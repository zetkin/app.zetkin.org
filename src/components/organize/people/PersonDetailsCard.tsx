import { useIntl } from 'react-intl';
import {
  Card,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Edit, LocationCity, Mail, Phone } from '@material-ui/icons';

import { ZetkinPerson } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';

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
  const intl = useIntl();
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
    <ZetkinSection
      title={intl.formatMessage({ id: 'pages.people.person.details.title' })}
    >
      <Card>
        <List disablePadding>
          {details.map((detail, idx) => (
            <div key={idx}>
              <ListItem>
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
    </ZetkinSection>
  );
};

export default PersonDetailsCard;
