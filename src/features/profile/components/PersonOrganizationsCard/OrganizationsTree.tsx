import {
  AccountTree,
  ArrowRight,
  Delete,
  SubdirectoryArrowRight,
} from '@mui/icons-material';
import {
  Collapse,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';

import globalMessageIds from 'core/i18n/messageIds';
import { useMessages } from 'core/i18n';
import messageIds from 'features/profile/l10n/messageIds';
import { PersonOrganization } from 'utils/organize/people';

type OrganizationProps = {
  editable: boolean;
  level?: number;
  onClickRemove: (orgId: PersonOrganization['id']) => void;
  organizationTree: PersonOrganization;
};

export const OrganizationsTree: React.FunctionComponent<OrganizationProps> = ({
  editable,
  level = 0,
  onClickRemove,
  organizationTree,
}) => {
  const { id, is_active, sub_orgs, title, role } = organizationTree;
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const hasChildren = !!sub_orgs?.length;
  const getIcon = () => {
    if (level === 0) {
      return <AccountTree />;
    }
    if (level === 1) {
      return <SubdirectoryArrowRight />;
    }
    if (level === 2) {
      return <ArrowRight />;
    }
  };

  return (
    <Collapse appear in>
      <ListItem
        sx={{
          opacity: is_active ? undefined : 0.3,
        }}
      >
        <ListItemIcon>{getIcon()}</ListItemIcon>
        <ListItemText
          primary={title}
          secondary={
            role ? globalMessages.roles[role]() : messages.role.noRole()
          }
          sx={{
            marginLeft: `${level * 10}px`,
          }}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => onClickRemove(id)} size="large">
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider
        sx={{
          marginLeft: '72px',
        }}
      />
      {hasChildren &&
        sub_orgs.map((org) => (
          <OrganizationsTree
            key={org.id}
            editable={editable}
            level={level + 1}
            onClickRemove={onClickRemove}
            organizationTree={org}
          />
        ))}
    </Collapse>
  );
};
