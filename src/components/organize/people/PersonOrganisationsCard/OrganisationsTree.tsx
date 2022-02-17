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

import { PersonOrganisation } from 'utils/organize/people';

type OrganisationProps = {
  editable: boolean;
  level?: number;
  organisationTree: PersonOrganisation;
};

export const OrganisationsTree: React.FunctionComponent<OrganisationProps> = ({
  editable,
  level = 0,
  organisationTree,
}) => {
  const { connected, sub_orgs, parent, title } = organisationTree;
  const hasChildren = !!sub_orgs?.length;

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
        <Fade in={editable && !!parent && connected}>
          <ListItemSecondaryAction>
            <IconButton edge="end">
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </Fade>
      </ListItem>
      <Divider style={{ marginLeft: 72 }} />
      {hasChildren &&
        sub_orgs.map((org) => (
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
