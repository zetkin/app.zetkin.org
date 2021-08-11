import { useIntl } from 'react-intl';
import { Box, Card, Grid } from '@material-ui/core';

import { ZetkinAssignedTask } from 'types/tasks';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinSection from 'components/ZetkinSection';

const TaskAssigneesList: React.FunctionComponent<{
    assignedTasks: ZetkinAssignedTask[];
}> = ({ assignedTasks }) => {
    const intl = useIntl();
    return (
        <ZetkinSection title={ intl.formatMessage({ id: 'misc.tasks.taskAssigneesList.title' }, { numPeople: assignedTasks.length }) }>
            <Grid container spacing={ 4 }>
                { assignedTasks.map(task => {
                    return (
                        <Grid key={ task.id } item lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                            <Card>
                                <Box p={ 3 }>
                                    <ZetkinPerson person={ task.assignee } subtitle={ task.completed ? 'Completed' : 'Not Completed' } />
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
