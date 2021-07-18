import { useIntl } from 'react-intl';
import { Card, Divider, List } from '@material-ui/core';

import TaskListItem from './TaskListItem';
import { ZetkinTask } from '../../../../types/zetkin';

interface TaskListProps {
    hrefBase: string;
    tasks: ZetkinTask[];
}

const TaskList = ({ hrefBase, tasks }: TaskListProps): JSX.Element => {
    const intl = useIntl();

    return (
        <Card>
            <List
                aria-label={ intl.formatMessage({ id: 'pages.organizeCampaigns.tasks' }) }>
                { tasks.map((task, index) => (
                    <>
                        <TaskListItem key={ task.id } hrefBase={ hrefBase } task={ task } />
                        {
                            // Show divider under all items except last
                            index !== tasks.length - 1 && (
                                <Divider />
                            )
                        }
                    </>
                )) }
            </List>
        </Card>
    );
};

export default TaskList;
