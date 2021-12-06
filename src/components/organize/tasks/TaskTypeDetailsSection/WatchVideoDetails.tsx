import TaskProperty from '../TaskProperty';
import { useIntl } from 'react-intl';
import { WatchVideoConfig } from 'types/tasks';

interface WatchVideoDetailsProps {
    taskConfig: Partial<WatchVideoConfig>;
}

const WatchVideoDetails: React.FunctionComponent<WatchVideoDetailsProps> = ({ taskConfig }) => {
    const intl = useIntl();

    return (
        <TaskProperty title={ intl.formatMessage({ id: 'misc.tasks.forms.watchVideoConfig.fields.url' }) } value={ taskConfig.url }/>
    );
};

export default WatchVideoDetails;
