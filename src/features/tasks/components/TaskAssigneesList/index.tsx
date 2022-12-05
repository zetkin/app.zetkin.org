import { useIntl } from 'react-intl';
import { Box, Card, Grid } from '@mui/material';

import TaskStatusSubtitle from './TaskStatusSubtitle';
import { ZetkinAssignedTask } from 'features/tasks/components/types';
import ZUIPerson from 'zui/ZUIPerson';
import ZUISection from 'zui/ZUISection';

import { sortAssignedTasks } from './utils';

const TaskAssigneesList: React.FunctionComponent<{
  assignedTasks: ZetkinAssignedTask[];
}> = ({ assignedTasks }) => {
  const intl = useIntl();

  const sortedAssignedTasks = assignedTasks.sort(sortAssignedTasks);

  return (
    <ZUISection
      title={intl.formatMessage(
        { id: 'misc.tasks.taskAssigneesList.title' },
        { numPeople: assignedTasks.length }
      )}
    >
      <Grid container spacing={4}>
        {sortedAssignedTasks.map((task) => {
          return (
            <Grid key={task.id} item lg={3} md={4} sm={6} xs={12}>
              <Card data-testid="task-assignee">
                <Box p={3}>
                  <ZUIPerson
                    id={task.assignee.id}
                    name={`${task.assignee.first_name} ${task.assignee.last_name}`}
                    subtitle={<TaskStatusSubtitle task={task} />}
                  />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </ZUISection>
  );
};

export default TaskAssigneesList;
