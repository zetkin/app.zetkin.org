import Link from 'next/link';
import { useRouter } from 'next/router';
import { ListItem, ListItemText } from '@material-ui/core';

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
        <ListItemText>{task.title}</ListItemText>
      </ListItem>
    </Link>
  );
};

export default TaskListItem;
