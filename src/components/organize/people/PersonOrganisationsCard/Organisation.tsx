import {
  AccountTree,
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
  organisationTree: OrganisationTree;
};

export const Organisation: React.FunctionComponent<OrganisationProps> = ({
  editable,
  organisationTree,
}) => {
  const { descendants, id, parentId, title } = organisationTree;
  const hasChildren = !!descendants?.length;

  return (
    <>
      <ListItem>
        <ListItemIcon>
          {!parentId ? <AccountTree /> : <SubdirectoryArrowRight />}
        </ListItemIcon>
        <ListItemText primary={title} />
        <Fade in={editable && !!parentId}>
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
          <Organisation key={id} editable={editable} organisationTree={org} />
        ))}
    </>
  );
};
