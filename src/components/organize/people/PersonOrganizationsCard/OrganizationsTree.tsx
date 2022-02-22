import {
  AccountTree,
  ArrowRight,
  Delete,
  SubdirectoryArrowRight,
} from '@material-ui/icons';
import {
  Collapse,
  Divider,
  Fade,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import { PersonOrganization } from 'utils/organize/people';
import { ZetkinOrganization } from 'types/zetkin';

type OrganizationProps = {
  editable: boolean;
  level?: number;
  onClickRemove: (orgId: ZetkinOrganization['id']) => void;
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
  const { connected, id, is_active, sub_orgs, parent, title } =
    organizationTree;
  const hasChildren = !!sub_orgs?.length;
  const classes = useStyles({ level });

  const getIcon = () => {
    if (level === 0) return <AccountTree />;
    if (level === 1) return <SubdirectoryArrowRight />;
    if (level === 2) return <ArrowRight />;
  };

  return (
    <Collapse appear in>
      <ListItem className={is_active ? undefined : classes.inactive}>
        <ListItemIcon>{getIcon()}</ListItemIcon>
        <ListItemText className={classes.listItemText} primary={title} />
        <Fade
          in={editable && !!parent && connected}
          timeout={400 + Math.random() * 400}
        >
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => onClickRemove(id)}>
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </Fade>
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
