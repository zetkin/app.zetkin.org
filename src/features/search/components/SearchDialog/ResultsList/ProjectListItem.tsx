import { Event } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinProject } from 'utils/types/zetkin';

const ProjectListItem: React.FunctionComponent<{
  project: ZetkinProject;
}> = ({ project }) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link key={project.id} href={`/organize/${orgId}/projects/${project.id}`}>
      <ListItem data-testid="SearchDialog-resultsListItem">
        <ListItemButton>
          <ListItemAvatar>
            <Avatar>
              <Event />
            </Avatar>
          </ListItemAvatar>
          <ResultsListItemText primary={project.title} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default ProjectListItem;
