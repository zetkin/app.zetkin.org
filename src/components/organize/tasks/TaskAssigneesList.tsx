import dayjs from 'dayjs';
import { Done } from '@material-ui/icons';
import { Box, Card, Grid } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import { ZetkinAssignedTask } from 'types/tasks';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import ZetkinSection from 'components/ZetkinSection';

const TaskAssigneesList: React.FunctionComponent<{
    assignedTasks: ZetkinAssignedTask[];
}> = ({ assignedTasks }) => {
    const intl = useIntl();

    const sortedAssignedTasks = assignedTasks.sort((first, second) => {
        const firstDate = dayjs(first.completed);
        const secondDate = dayjs(second.completed);

        if (!first.completed && second.completed) return 1;
        if (first.completed && !second.completed) return -1;

        if (firstDate.isBefore(secondDate)) return 1;
        if (firstDate.isAfter(secondDate)) return -1;

        return 0;
    });

    return (
        <ZetkinSection title={ intl.formatMessage({ id: 'misc.tasks.taskAssigneesList.title' }, { numPeople: assignedTasks.length }) }>
            <Grid container spacing={ 4 }>
                { sortedAssignedTasks.map(task => {
                    const completedText = task.completed ?
                        (
                            <Box alignItems="center" display="flex">
                                <Done fontSize="small"/>
                                <Box>
                                    <FormattedMessage
                                        id="misc.tasks.taskAssigneesList.completedStates.completed"
                                        values={{
                                            time: <ZetkinRelativeTime datetime={ task.completed as string } />,
                                        }}
                                    />
                                </Box>
                            </Box>
                        ) :
                        intl.formatMessage({ id: 'misc.tasks.taskAssigneesList.completedStates.notCompleted' });

                    return (
                        <Grid key={ task.id } item lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                            <Card>
                                <Box p={ 3 }>
                                    <ZetkinPerson
                                        id={ task.assignee.id }
                                        name={ `${task.assignee.first_name} ${task.assignee.last_name}` }
                                        subtitle={ completedText }
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
