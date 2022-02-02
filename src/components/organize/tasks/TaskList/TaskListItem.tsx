import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FormatListNumbered,
  Link as LinkIcon,
  NaturePeople,
  Share,
  VideoLibrary,
} from '@material-ui/icons';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';

import { TASK_TYPE } from 'types/tasks';
import { ZetkinTask } from 'types/zetkin';

import TaskStatusText from '../TaskStatusText';

const TASK_TYPE_ICONS: { [key in TASK_TYPE]: React.ReactNode } = {
  [TASK_TYPE.OFFLINE]: <NaturePeople />,
  [TASK_TYPE.COLLECT_DEMOGRAPHICS]: <FormatListNumbered />,
  [TASK_TYPE.SHARE_LINK]: <Share />,
  [TASK_TYPE.SHARE_IMAGE]: <Share />,
  [TASK_TYPE.VISIT_LINK]: <LinkIcon />,
  [TASK_TYPE.WATCH_VIDEO]: <VideoLibrary />,
};

interface TaskListItemProps {
  task: ZetkinTask;
}

const TaskListItem = ({ task }: TaskListItemProps): JSX.Element => {
  const { id, title } = task;
  const { orgId, campId } = useRouter().query;

  return (
    <Link
      href={`/organize/${orgId}/campaigns/${campId}/calendar/tasks/${id}`}
      passHref
    >
      <ListItem button component="a">
        <ListItemIcon>{TASK_TYPE_ICONS[task.type]}</ListItemIcon>
        <ListItemText>
          {/* Title */}
          <Typography component="h5" variant="body1">
            {title}
          </Typography>
          {/* Description */}
          <Typography color="textPrimary" variant="body2">
            <TaskStatusText task={task} />
          </Typography>
        </ListItemText>
      </ListItem>
    </Link>
  );
};

export default TaskListItem;
