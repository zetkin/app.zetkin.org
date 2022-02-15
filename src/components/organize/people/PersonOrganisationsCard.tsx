import { AccountTree, SubdirectoryArrowRight } from '@material-ui/icons';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import PersonCard from './PersonCard';
import { personConnectionsResource } from 'api/people';
import { PersonProfilePageProps } from 'pages/organize/[orgId]/people/[personId]';

const PersonOrganisationsCard: React.FunctionComponent<
  PersonProfilePageProps
> = ({ orgId, personId }) => {
  const { data: connections } = personConnectionsResource(
    orgId,
    personId
  ).useQuery();

  if (!connections) return null;
  const parentOrg = connections.filter(
    (conn) => conn.organization.id.toString() === orgId
  )[0].organization;

  const personOrgs = [parentOrg].concat(
    connections
      .filter((conn) => conn.organization.id.toString() !== orgId)
      .map((conn) => conn.organization)
  );

  return (
    <PersonCard titleId="pages.people.person.organisations.title">
      <List disablePadding>
        {personOrgs.map((organization, idx) => (
          <div key={idx}>
            <ListItem button>
              <ListItemIcon>
                {!idx ? <AccountTree /> : <SubdirectoryArrowRight />}
              </ListItemIcon>
              <ListItemText primary={organization.title} />
            </ListItem>
            <Divider style={{ marginLeft: 72 }} />
          </div>
        ))}
      </List>
    </PersonCard>
  );
};

export default PersonOrganisationsCard;
