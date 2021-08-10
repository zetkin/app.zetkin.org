import { Grid } from '@material-ui/core';

import { ZetkinAssignedTask } from 'types/tasks';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinSection from 'components/ZetkinSection';

const TaskAssigneesList: React.FunctionComponent<{
    assignedTasks: ZetkinAssignedTask[];
}> = ({ assignedTasks }) => {

    return (
        <ZetkinSection title="Assigned to">
            <Grid container spacing={ 3 }>
                { assignedTasks.map(task => {
                    return (
                        <Grid key={ task.id } item lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                            <ZetkinPerson person={ task.assignee } subtitle={ task.completed ? 'Completed' : 'Not Completed' } />
                        </Grid>
                    );
                }) }
            </Grid>
        </ZetkinSection>
    );
};

export default TaskAssigneesList;
