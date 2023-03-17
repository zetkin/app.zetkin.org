import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import TabbedLayout from '../../../utils/layout/TabbedLayout';

import getTaskStatus from 'features/tasks/utils/getTaskStatus';
import TaskActionButtons from '../components/TaskActionButtons';
import { taskResource } from '../api/tasks';
import TaskStatusChip from '../components/TaskStatusChip';
import TaskStatusText from '../components/TaskStatusText';
import { useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface SingleTaskLayoutProps {
  children: React.ReactNode;
}

const SingleTaskLayout: FunctionComponent<SingleTaskLayoutProps> = ({
  children,
}) => {
  const messages = useMessages(messageIds);
  const { taskId, orgId, campId } = useRouter().query;
  const { data: task } = taskResource(
    orgId as string,
    taskId as string
  ).useQuery();

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
