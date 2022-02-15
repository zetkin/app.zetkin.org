import { Clear } from '@material-ui/icons';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import PersonCard from './PersonCard';
import { ZetkinMembership } from 'types/zetkin';

const PersonOrganisationsCard: React.FunctionComponent<{
  connections?: ZetkinMembership[];
}> = ({ connections }) => {
  if (!connections) return null;
  return (
    <PersonCard titleId="pages.people.person.organisations.title">
      <List disablePadding>
        {connections.map((connection, idx) => (
          <div key={idx}>
            <ListItem button>
              <ListItemIcon>
                <Clear />
              </ListItemIcon>
              <ListItemText primary={connection.organization.title} />
            </ListItem>
            <Divider style={{ marginLeft: 72 }} />
          </div>
        ))}
      </List>
    </PersonCard>
  );
};

export default PersonOrganisationsCard;
