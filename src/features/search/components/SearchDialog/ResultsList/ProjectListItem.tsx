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
import messageIds from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

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
          <ResultsListItemText
            primary={project.title}
            secondary={<Msg id={messageIds.results.project} />}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default ProjectListItem;
