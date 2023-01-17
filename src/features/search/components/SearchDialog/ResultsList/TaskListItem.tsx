import Link from 'next/link';
import { MobileFriendly } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinTask } from 'utils/types/zetkin';

const TaskListItem: React.FunctionComponent<{ task: ZetkinTask }> = ({
  task,
}) => {
  const intl = useIntl();
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const elements = [
    intl.formatMessage({ id: 'misc.search.results.task.campaign' }),
    task.campaign.title,
    intl.formatMessage({ id: 'misc.search.results.task.task' }),
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
