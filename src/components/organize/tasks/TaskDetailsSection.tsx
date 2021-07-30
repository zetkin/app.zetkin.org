import { useIntl } from 'react-intl';

import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTask } from 'types/zetkin';

import TaskProperty from './TaskProperty';

interface TaskDetailsCardProps {
    task: ZetkinTask;
}

const TaskDetailsCard: React.FunctionComponent<TaskDetailsCardProps> = ({ task }) => {
    const intl = useIntl();
    return (
        <ZetkinSection title={ intl.formatMessage({ id: 'misc.tasks.taskDetails.title' }) }>
            <TaskProperty
                title={ intl.formatMessage({ id: 'misc.tasks.taskDetails.titleLabel' }) }
                value={ task.title }
            />
            <TaskProperty
                title={ intl.formatMessage({ id: 'misc.tasks.taskDetails.instructionsLabel' }) }
                value={ task.instructions }
            />
            <TaskProperty
                title={ intl.formatMessage({ id: 'misc.tasks.taskDetails.typeLabel' }) }
                value={ intl.formatMessage({ id: `misc.tasks.types.${task.type}` }) }
            />
        </ZetkinSection>
    );
};

export default TaskDetailsCard;
