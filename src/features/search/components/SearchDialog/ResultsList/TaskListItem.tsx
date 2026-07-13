import Link from 'next/link';
import { MobileFriendly } from '@mui/icons-material';
import { useRouter } from 'next/router';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinTask } from 'utils/types/zetkin';
import messageIds from '../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const TaskListItem: React.FunctionComponent<{ task: ZetkinTask }> = ({
  task,
}) => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const elements = [
    messages.results.project(),
    task.campaign.title,
    messages.results.task(),
  ];

  return (
    <Link
      href={`/organize/${orgId}/projects/${task.campaign.id}/tasks/${task.id}`}
    >
      <ListItem data-testid="SearchDialog-resultsListItem">
        <ListItemButton>
          <ListItemAvatar>
            <Avatar>
              <MobileFriendly />
            </Avatar>
          </ListItemAvatar>
          <ResultsListItemText
            primary={task.title}
            secondary={elements.join(' / ')}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default TaskListItem;
