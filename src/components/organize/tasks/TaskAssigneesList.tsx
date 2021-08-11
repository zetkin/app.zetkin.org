import { useIntl } from 'react-intl';
import { Box, Card, Grid } from '@material-ui/core';

import { ZetkinAssignedTask } from 'types/tasks';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import ZetkinSection from 'components/ZetkinSection';

const TaskAssigneesList: React.FunctionComponent<{
    assignedTasks: ZetkinAssignedTask[];
}> = ({ assignedTasks }) => {
    const intl = useIntl();

    return (
        <ZetkinSection title={ intl.formatMessage({ id: 'misc.tasks.taskAssigneesList.title' }, { numPeople: assignedTasks.length }) }>
            <Grid container spacing={ 4 }>
                { assignedTasks.map(task => {
                    const completedText = task.completed ?
                        // Relative completed time
                        intl.formatMessage({
                            id: 'misc.tasks.taskAssigneesList.completedStates.completed',
                        }, {
                            time:  <ZetkinRelativeTime datetime={ task.completed as string } />,
                        }) :
                        intl.formatMessage({ id: 'misc.tasks.taskAssigneesList.completedStates.notCompleted' });

                    return (
                        <Grid key={ task.id } item lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                            <Card>
                                <Box p={ 3 }>
                                    <ZetkinPerson person={ task.assignee } subtitle={ completedText } />
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
