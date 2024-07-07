import { ShareLinkConfig } from 'features/tasks/components/types';
import TaskProperty from '../TaskProperty';
import { useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';

interface ShareLinkDetailsProps {
  taskConfig: Partial<ShareLinkConfig>;
}

const ShareLinkDetails: React.FunctionComponent<ShareLinkDetailsProps> = ({
  taskConfig,
}) => {
  const messages = useMessages(messageIds);

  return (
    <>
      <TaskProperty
        title={messages.configs.shareLink.fields.url()}
        url
        value={taskConfig.url}
      />
      <TaskProperty
        title={messages.configs.shareLink.fields.url()}
        value={taskConfig.default_message}
      />
    </>
  );
};

export default ShareLinkDetails;
