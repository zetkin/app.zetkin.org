import { Clear } from '@material-ui/icons';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import PersonCard from './PersonCard';
import { ZetkinOrganization } from 'types/zetkin';

const PersonOrganisationsCard: React.FunctionComponent<{
  organisations: ZetkinOrganization[];
}> = ({ organisations }) => {
  return (
    <PersonCard titleId="pages.people.person.organisations.title">
      <List disablePadding>
        {organisations.map((organisation, idx) => (
          <div key={idx}>
            <ListItem button>
              <ListItemIcon>
                <Clear />
              </ListItemIcon>
              <ListItemText primary={organisation.title} />
            </ListItem>
            <Divider style={{ marginLeft: 72 }} />
          </div>
        ))}
      </List>
    </PersonCard>
  );
};

export default PersonOrganisationsCard;
