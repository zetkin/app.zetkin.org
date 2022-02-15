import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { LocationCity, Mail, Phone } from '@material-ui/icons';

import PersonCard from './PersonCard';
import { ZetkinPerson } from 'types/zetkin';

const PersonDetailsCard: React.FunctionComponent<{ person: ZetkinPerson }> = ({
  person,
}) => {
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
    <PersonCard titleId="pages.people.person.details.title">
      <List disablePadding>
        {details.map((detail, idx) => (
          <div key={idx}>
            <ListItem button>
              <ListItemIcon>{detail.icon}</ListItemIcon>
              <ListItemText primary={detail.value} />
            </ListItem>
            <Divider style={{ marginLeft: 72 }} />
          </div>
        ))}
      </List>
    </PersonCard>
  );
};

export default PersonDetailsCard;
