import { useIntl } from 'react-intl';
import { Box, Card, Grid } from '@material-ui/core';

import TaskStatusSubtitle from './TaskStatusSubtitle';
import { ZetkinAssignedTask } from 'types/tasks';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinSection from 'components/ZetkinSection';

import { sortAssignedTasks } from './utils';



const TaskAssigneesList: React.FunctionComponent<{ assignedTasks: ZetkinAssignedTask[] }> = ({ assignedTasks }) => {
    const intl = useIntl();

    const sortedAssignedTasks = assignedTasks.sort(sortAssignedTasks);

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
