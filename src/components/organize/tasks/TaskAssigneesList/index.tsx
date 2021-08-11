import { Box, Card, Grid } from '@material-ui/core';

import { ZetkinAssignedTask } from 'types/tasks';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinSection from 'components/ZetkinSection';

const TaskAssigneesList: React.FunctionComponent<{
    assignedTasks: ZetkinAssignedTask[];
}> = ({ assignedTasks }) => {

    return (
        <ZetkinSection title="Assigned to">
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
