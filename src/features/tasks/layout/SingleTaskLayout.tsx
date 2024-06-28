import { Box } from '@mui/material';
import { FunctionComponent } from 'react';

import TabbedLayout from '../../../utils/layout/TabbedLayout';
import getTaskStatus from 'features/tasks/utils/getTaskStatus';
import TaskActionButtons from '../components/TaskActionButtons';
import TaskStatusChip from '../components/TaskStatusChip';
import TaskStatusText from '../components/TaskStatusText';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useTask from '../hooks/useTask';
import messageIds from '../l10n/messageIds';

interface SingleTaskLayoutProps {
  children: React.ReactNode;
}

const SingleTaskLayout: FunctionComponent<SingleTaskLayoutProps> = ({
  children,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, taskId, campId } = useNumericRouteParams();
  const task = useTask(orgId, taskId);
  if (!task) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={<TaskActionButtons task={task} />}
      baseHref={`/organize/${orgId}/projects/${campId}/calendar/tasks/${taskId}`}
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <Box mr={1}>
            <TaskStatusChip status={getTaskStatus(task)} />
          </Box>
          <Box>
            <TaskStatusText task={task} />
          </Box>
        </Box>
      }
      tabs={[
        { href: `/`, label: messages.taskLayout.tabs.summary() },
        {
          href: `/assignees`,
          label: messages.taskLayout.tabs.assignees(),
        },
        { href: `/insights`, label: messages.taskLayout.tabs.insights() },
      ]}
      title={task?.title}
    >
      {children}
    </TabbedLayout>
  );
};

export default SingleTaskLayout;
