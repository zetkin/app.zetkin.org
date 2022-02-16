import {
  AccountTree,
  ArrowRight,
  Delete,
  SubdirectoryArrowRight,
} from '@material-ui/icons';
import {
  Divider,
  Fade,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';

import { OrganisationTree } from 'api/people';

type OrganisationProps = {
  editable: boolean;
  level?: number;
  organisationTree: OrganisationTree;
};

export const OrganisationsTree: React.FunctionComponent<OrganisationProps> = ({
  editable,
  level = 0,
  organisationTree,
}) => {
  const { connected, descendants, parentId, title } = organisationTree;
  const hasChildren = !!descendants?.length;

  const getIcon = () => {
    if (level === 0) return <AccountTree />;
    if (level === 1) return <SubdirectoryArrowRight />;
    if (level === 2) return <ArrowRight />;
  };

  return (
    <>
      <ListItem>
        <ListItemIcon>{getIcon()}</ListItemIcon>
        <ListItemText primary={title} style={{ marginLeft: level * 10 }} />
        <Fade in={editable && !!parentId && connected}>
          <ListItemSecondaryAction>
            <IconButton edge="end">
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </Fade>
      </ListItem>
      <Divider style={{ marginLeft: 72 }} />
      {hasChildren &&
        descendants.map((org) => (
          <OrganisationsTree
            key={org.id}
            editable={editable}
            level={level + 1}
            organisationTree={org}
          />
        ))}
    </>
  );
};
