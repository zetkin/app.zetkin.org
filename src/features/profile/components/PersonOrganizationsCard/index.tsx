import { Add } from '@mui/icons-material';
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';

import OrganizationSelect from './OrganizationSelect';
import { OrganizationsTree } from './OrganizationsTree';
import PersonCard from '../PersonCard';
import { PersonOrganization } from 'utils/organize/people';
import { personOrganizationsResource } from 'features/profile/api/people';
import { useMessages } from 'core/i18n';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

import messageIds from 'features/profile/l10n/messageIds';

interface PersonOrganizationsCardProps {
  orgId: string;
  personId: string;
}

const PersonOrganizationsCard: React.FunctionComponent<
  PersonOrganizationsCardProps
> = ({ orgId, personId }) => {
  const messages = useMessages(messageIds);
  const [editable, setEditable] = useState<boolean>(false);
  const [addable, setAddable] = useState<boolean>(false);
  const [selected, setSelected] = useState<PersonOrganization>();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { showSnackbar } = useContext(ZUISnackbarContext);
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
    if (selected) {
      addOrgMutation.mutate(selected.id, {
        onError: () => showSnackbar('error', messages.organizations.addError()),
        onSuccess: () => setSelected(undefined),
      });
    }
  };

  const removeSubOrg = (subOrgId: PersonOrganization['id']) => {
    showConfirmDialog({
      onSubmit: () => {
        removeOrgMutation.mutate(subOrgId, {
          onError: () =>
            showSnackbar('error', messages.organizations.removeError()),
          onSuccess: () => setSelected(undefined),
        });
      },
    });
  };

  if (!data?.organizationTree) {
    return null;
  }

  return (
    <PersonCard
      onClickEdit={() => setEditable(!editable)}
      title={messages.organizations.title()}
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
              primary={messages.organizations.add()}
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
