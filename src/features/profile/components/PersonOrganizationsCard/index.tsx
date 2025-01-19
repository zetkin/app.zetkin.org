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
import { useRouter } from 'next/router';

import OrganizationSelect from './OrganizationSelect';
import { OrganizationsTree } from './OrganizationsTree';
import PersonCard from '../PersonCard';
import { PersonOrganization } from 'utils/organize/people';
import { useMessages } from 'core/i18n';
import usePersonOrgData from 'features/profile/hooks/usePersonOrgData';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import messageIds from 'features/profile/l10n/messageIds';

interface PersonOrganizationsCardProps {
  orgId: number;
  personId: number;
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
  const { data, addToOrg, removeFromOrg } = usePersonOrgData(orgId, personId);
  const router = useRouter();

  useEffect(() => {
    if (!editable) {
      setAddable(false);
      setSelected(undefined);
    }
  }, [editable]);

  const selectSubOrg = (selectedOrg?: PersonOrganization) => {
    setSelected(selectedOrg);
  };

  const submitSubOrg = async () => {
    if (selected) {
      try {
        await addToOrg(selected.id);
        setSelected(undefined);
      } catch (err) {
        showSnackbar('error', messages.organizations.addError());
      }
    }
  };

  const removeSubOrg = (subOrgId: PersonOrganization['id']) => {
    showConfirmDialog({
      onSubmit: async () => {
        try {
          await removeFromOrg(subOrgId);
          setSelected(undefined);
          if (orgId == subOrgId) {
            router.push(`/organize/${orgId}/people`);
          }
        } catch (err) {
          showSnackbar('error', messages.organizations.removeError());
        }
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
