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
import makeStyles from '@mui/styles/makeStyles';

import { PersonOrganization } from 'utils/organize/people';

type OrganizationProps = {
  editable: boolean;
  level?: number;
  onClickRemove: (orgId: PersonOrganization['id']) => void;
  organizationTree: PersonOrganization;
};

const useStyles = makeStyles({
  divider: {
    marginLeft: 72,
  },
  inactive: {
    opacity: 0.3,
  },
  listItemText: {
    marginLeft: ({ level }: { level: number }) => level * 10,
  },
});

export const OrganizationsTree: React.FunctionComponent<OrganizationProps> = ({
  editable,
  level = 0,
  onClickRemove,
  organizationTree,
}) => {
  const { id, is_active, sub_orgs, title } = organizationTree;
  const hasChildren = !!sub_orgs?.length;
  const classes = useStyles({ level });

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
      <ListItem className={is_active ? undefined : classes.inactive}>
        <ListItemIcon>{getIcon()}</ListItemIcon>
        <ListItemText className={classes.listItemText} primary={title} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => onClickRemove(id)} size="large">
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider className={classes.divider} />
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
