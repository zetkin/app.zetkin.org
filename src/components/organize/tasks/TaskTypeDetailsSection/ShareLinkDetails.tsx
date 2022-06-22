import { ShareLinkConfig } from 'types/tasks';
import TaskProperty from '../TaskProperty';
import { useIntl } from 'react-intl';

interface ShareLinkDetailsProps {
  taskConfig: Partial<ShareLinkConfig>;
}

const ShareLinkDetails: React.FunctionComponent<ShareLinkDetailsProps> = ({
  taskConfig,
}) => {
  const intl = useIntl();

  return (
    <>
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.forms.shareLinkConfig.fields.url',
        })}
        url
        value={taskConfig.url}
      />
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.forms.shareLinkConfig.fields.default_message',
        })}
        value={taskConfig.default_message}
      />
    </>
  );
};

export default ShareLinkDetails;
