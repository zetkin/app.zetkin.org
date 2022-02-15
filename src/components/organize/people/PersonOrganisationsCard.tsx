import { useIntl } from 'react-intl';
import { useState } from 'react';
import {
  AccountTree,
  Add,
  Delete,
  SubdirectoryArrowRight,
} from '@material-ui/icons';
import {
  Collapse,
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';

import PersonCard from './PersonCard';
import { personConnectionsResource } from 'api/people';
import { PersonProfilePageProps } from 'pages/organize/[orgId]/people/[personId]';

const PersonOrganisationsCard: React.FunctionComponent<
  PersonProfilePageProps
> = ({ orgId, personId }) => {
  const [editable, setEditable] = useState<boolean>();
  const intl = useIntl();
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
    <PersonCard
      onClickEdit={() => setEditable(!editable)}
      titleId="pages.people.person.organisations.title"
    >
      <List disablePadding>
        {personOrgs.map((organization, idx) => (
          <div key={idx}>
            <ListItem>
              <ListItemIcon>
                {!idx ? <AccountTree /> : <SubdirectoryArrowRight />}
              </ListItemIcon>
              <ListItemText primary={organization.title} />
              <Fade in={editable && !!idx}>
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </Fade>
            </ListItem>
            <Divider style={{ marginLeft: 72 }} />
          </div>
        ))}
        <Collapse in={editable}>
          <ListItem button color="primary">
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText
              color="primary"
              primary={intl.formatMessage({
                id: 'pages.people.person.organisations.add',
              })}
            />
          </ListItem>
        </Collapse>
        {editable && <Divider style={{ marginLeft: 72 }} />}
      </List>
    </PersonCard>
  );
};

export default PersonOrganisationsCard;
