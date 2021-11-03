import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { Box, Card, Grid } from '@material-ui/core';

import TaskStatusSubtitle from './TaskStatusSubtitle';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinSection from 'components/ZetkinSection';
import { ASSIGNED_STATUS, ZetkinAssignedTask } from 'types/tasks';

const TaskAssigneesList: React.FunctionComponent<{ assignedTasks: ZetkinAssignedTask[] }> = ({ assignedTasks }) => {
    const intl = useIntl();

    const sortedAssignedTasks = assignedTasks.sort((first, second) => {
        if (first.status === ASSIGNED_STATUS.COMPLETED && second.status !== ASSIGNED_STATUS.COMPLETED) return -1;
        if (first.status !== ASSIGNED_STATUS.COMPLETED && second.status === ASSIGNED_STATUS.COMPLETED) return 1;
        if (first.status === ASSIGNED_STATUS.ASSIGNED && second.status === ASSIGNED_STATUS.IGNORED) return 1;
        if (first.status === ASSIGNED_STATUS.IGNORED && second.status === ASSIGNED_STATUS.ASSIGNED) return -1;

        const firstDate = first.completed ? dayjs(first.completed) : first.ignored ? dayjs(first.ignored) : dayjs(first.assigned);
        const secondDate = second.completed ? dayjs(second.completed) : second.ignored ? dayjs(second.ignored) : dayjs(second.assigned);

        return secondDate.diff(firstDate);
    });

    return (
        <ZetkinSection title={ intl.formatMessage({ id: 'misc.tasks.taskAssigneesList.title' }, { numPeople: assignedTasks.length }) }>
            <Grid container spacing={ 4 }>
                { sortedAssignedTasks.map(task => {
                    return (
                        <Grid key={ task.id } item lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                            <Card data-testid="task-assignee">
                                <Box p={ 3 }>
                                    <ZetkinPerson
                                        id={ task.assignee.id }
                                        name={ `${task.assignee.first_name} ${task.assignee.last_name}` }
                                        subtitle={ <TaskStatusSubtitle task={ task }/> }
                                    />
                                </Box>
                            </Card>
                        </Grid>
                    );
                }) }
            </Grid>
        </ZetkinSection>
    );
};

export default TaskAssigneesList;
