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

import { ConfirmDialogContext } from 'hooks/ConfirmDialogProvider';
import OrganizationSelect from './OrganizationSelect';
import { OrganizationsTree } from './OrganizationsTree';
import PersonCard from '../PersonCard';
import { PersonOrganization } from 'utils/organize/people';
import { personOrganizationsResource } from 'api/people';
import { PersonProfilePageProps } from 'pages/organize/[orgId]/people/[personId]';
import SnackbarContext from 'hooks/SnackbarContext';

const PersonOrganizationsCard: React.FunctionComponent<
  PersonProfilePageProps
> = ({ orgId, personId }) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [addable, setAddable] = useState<boolean>(false);
  const [selected, setSelected] = useState<PersonOrganization>();
  const intl = useIntl();
  const { showConfirmDialog } = useContext(ConfirmDialogContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const { data } = personOrganizationsResource(orgId, personId).useQuery();

  const addOrgMutation = personOrganizationsResource(orgId, personId).useAdd();
  const removeOrgMutation = personOrganizationsResource(
    orgId,
    personId
  ).useRemove();

  useEffect(() => {
    if (!editable) {
      setAddable(false);
      setSelected(undefined);
    }
  }, [editable]);

  const selectSubOrg = (selectedOrg?: PersonOrganization) => {
    setSelected(selectedOrg);
  };

  const submitSubOrg = () => {
    if (selected)
      addOrgMutation.mutate(selected.id, {
        onError: () =>
          showSnackbar(
            'error',
            intl.formatMessage({
              id: 'pages.people.person.organizations.addError',
            })
          ),
        onSuccess: () => setSelected(undefined),
      });
  };

  const removeSubOrg = (subOrgId: PersonOrganization['id']) => {
    showConfirmDialog({
      onSubmit: () => {
        removeOrgMutation.mutate(subOrgId, {
          onError: () =>
            showSnackbar(
              'error',
              intl.formatMessage({
                id: 'pages.people.person.organizations.removeError',
              })
            ),
          onSuccess: () => setSelected(undefined),
        });
      },
    });
  };

  if (!data?.organizationTree) return null;

  return (
    <PersonCard
      onClickEdit={() => setEditable(!editable)}
      titleId="pages.people.person.organizations.title"
    >
      <List disablePadding>
        <OrganizationsTree
          editable={editable}
          onClickRemove={removeSubOrg}
          organizationTree={data.personOrganizationTree}
        />
        <Collapse in={editable && !addable}>
          <ListItem button color="primary" onClick={() => setAddable(!addable)}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText
              color="primary"
              primary={intl.formatMessage({
                id: 'pages.people.person.organizations.add',
              })}
            />
          </ListItem>
        </Collapse>
        <Collapse in={editable && addable}>
          <ListItem color="primary">
            <OrganizationSelect
              memberships={data.memberships}
              onSelect={selectSubOrg}
              onSubmit={submitSubOrg}
              options={data.subOrganizations.filter((org) => !!org.parent)}
              selected={selected}
            />
          </ListItem>
        </Collapse>
        {editable && <Divider style={{ marginLeft: 72 }} />}
      </List>
    </PersonCard>
  );
};

export default PersonOrganizationsCard;
