import { useIntl } from 'react-intl';

import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTask } from 'types/zetkin';

import { TASK_TYPE } from 'types/tasks';
import TaskProperty from '../TaskProperty';

interface TaskTypeDetailsProps {
    task: ZetkinTask;
}

const TaskTypeDetailsSection: React.FunctionComponent<TaskTypeDetailsProps> = ({ task }) => {
    const intl = useIntl();
    const { type } = task;

    if (type === TASK_TYPE.OFFLINE) return null;

    return (
        <ZetkinSection title={ intl.formatMessage({ id: `misc.tasks.taskTypeDetails.${type}.title` }) }>
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

export default TaskTypeDetailsSection;
