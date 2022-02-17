import { Add } from '@material-ui/icons';
import { useIntl } from 'react-intl';
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';

import OrganisationSelect from './OrganisationSelect';
import { OrganisationsTree } from './OrganisationsTree';
import PersonCard from '../PersonCard';
import { personOrganisationsResource } from 'api/people';
import { PersonProfilePageProps } from 'pages/organize/[orgId]/people/[personId]';
import SnackbarContext from 'hooks/SnackbarContext';
import { ZetkinOrganization } from 'types/zetkin';

const PersonOrganisationsCard: React.FunctionComponent<
  PersonProfilePageProps
> = ({ orgId, personId }) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [addable, setAddable] = useState<boolean>(false);
  const [selected, setSelected] = useState<ZetkinOrganization>();
  const intl = useIntl();
  const { showSnackbar } = useContext(SnackbarContext);
  const { data } = personOrganisationsResource(orgId, personId).useQuery();

  const createConnectionMutation = personOrganisationsResource(
    orgId,
    personId
  ).useAdd();

  useEffect(() => {
    if (!editable) {
      setAddable(false);
      setSelected(undefined);
    }
  }, [editable]);

  const onSelectSubOrg = (selectedOrg: ZetkinOrganization) => {
    setSelected(selectedOrg);
  };

  const onSubmitSubOrg = () => {
    if (selected)
      createConnectionMutation.mutate(selected.id, {
        onError: () =>
          showSnackbar(
            'error',
            intl.formatMessage({
              id: 'pages.people.person.organisations.addError',
            })
          ),
        onSuccess: () => setSelected(undefined),
      });
  };

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
        <Collapse in={editable && !addable}>
          <ListItem button color="primary" onClick={() => setAddable(!addable)}>
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
        <Collapse in={editable && addable}>
          <ListItem color="primary">
            <OrganisationSelect
              memberships={data.memberships}
              onSelect={onSelectSubOrg}
              onSubmit={onSubmitSubOrg}
              options={data.subOrganisations}
              selected={selected}
            />
          </ListItem>
        </Collapse>
        {editable && <Divider style={{ marginLeft: 72 }} />}
      </List>
    </PersonCard>
  );
};

export default PersonOrganisationsCard;
