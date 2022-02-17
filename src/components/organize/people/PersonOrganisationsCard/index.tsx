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
  const { showConfirmDialog } = useContext(ConfirmDialogContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const { data } = personOrganisationsResource(orgId, personId).useQuery();

  const addOrgMutation = personOrganisationsResource(orgId, personId).useAdd();
  const removeOrgMutation = personOrganisationsResource(
    orgId,
    personId
  ).useRemove();

  useEffect(() => {
    if (!editable) {
      setAddable(false);
      setSelected(undefined);
    }
  }, [editable]);

  const selectSubOrg = (selectedOrg?: ZetkinOrganization) => {
    setSelected(selectedOrg);
  };

  const submitSubOrg = () => {
    if (selected)
      addOrgMutation.mutate(selected.id, {
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

  const removeSubOrg = (subOrgId: ZetkinOrganization['id']) => {
    showConfirmDialog({
      onSubmit: () => {
        removeOrgMutation.mutate(subOrgId, {
          onError: () =>
            showSnackbar(
              'error',
              intl.formatMessage({
                id: 'pages.people.person.organisations.removeError',
              })
            ),
          onSuccess: () => setSelected(undefined),
        });
      },
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
          onClickRemove={removeSubOrg}
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
              onSelect={selectSubOrg}
              onSubmit={submitSubOrg}
              options={data.subOrganisations.filter((org) => !!org.parent)}
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
