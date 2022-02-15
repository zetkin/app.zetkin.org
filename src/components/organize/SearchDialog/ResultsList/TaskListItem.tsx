import Link from 'next/link';
import { MobileFriendly } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@material-ui/core';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinTask } from 'types/zetkin';

const TaskListItem: React.FunctionComponent<{ task: ZetkinTask }> = ({
  task,
}) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link
      key={task.id}
      href={`/organize/${orgId}/campaigns/${task.campaign.id}/calendar/tasks/${task.id}`}
      passHref
    >
      <ListItem button component="a">
        <ListItemAvatar>
          <Avatar>
            <MobileFriendly />
          </Avatar>
        </ListItemAvatar>
        <ResultsListItemText
          primary={task.title}
          secondary={'Campaign / ' + task.campaign.title + ' / Task'}
        />
      </ListItem>
    </Link>
  );
};

export default TaskListItem;
