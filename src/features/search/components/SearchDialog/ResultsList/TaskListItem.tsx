import Link from 'next/link';
import { MobileFriendly } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinTask } from 'utils/types/zetkin';

import messages from '../../../messages';
import { useMessages } from 'core/i18n';

const TaskListItem: React.FunctionComponent<{ task: ZetkinTask }> = ({
  task,
}) => {
  const msg = useMessages(messages);
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const elements = [
    msg.results.campaign(),
    task.campaign.title,
    msg.results.task(),
  ];

  return (
    <Link
      key={task.id}
      href={`/organize/${orgId}/campaigns/${task.campaign.id}/calendar/tasks/${task.id}`}
      passHref
    >
      <ListItem button component="a" data-testid="SearchDialog-resultsListItem">
        <ListItemAvatar>
          <Avatar>
            <MobileFriendly />
          </Avatar>
        </ListItemAvatar>
        <ResultsListItemText
          primary={task.title}
          secondary={elements.join(' / ')}
        />
      </ListItem>
    </Link>
  );
};

export default TaskListItem;
