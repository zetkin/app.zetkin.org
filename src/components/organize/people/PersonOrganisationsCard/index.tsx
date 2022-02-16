import { Add } from '@material-ui/icons';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import { OrganisationsTree } from './OrganisationsTree';
import PersonCard from '../PersonCard';
import { personOrganisationsResource } from 'api/people';
import { PersonProfilePageProps } from 'pages/organize/[orgId]/people/[personId]';

const PersonOrganisationsCard: React.FunctionComponent<
  PersonProfilePageProps
> = ({ orgId, personId }) => {
  const [editable, setEditable] = useState<boolean>(false);
  const intl = useIntl();
  const { data } = personOrganisationsResource(orgId, personId).useQuery();

  if (!data?.organisationTree) return null;

  return (
    <PersonCard
      onClickEdit={() => setEditable(!editable)}
      titleId="pages.people.person.organisations.title"
    >
      <List disablePadding>
        <OrganisationsTree
          editable={editable}
          organisationTree={data.personOrganisationTree}
        />
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
