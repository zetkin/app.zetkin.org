import TaskProperty from '../TaskProperty';
import { useMessages } from 'core/i18n';
import { VisitLinkConfig } from 'features/tasks/components/types';

import messageIds from 'features/tasks/l10n/messageIds';

interface VisitLinkDetailsProps {
  taskConfig: Partial<VisitLinkConfig>;
}

const VisitLinkDetails: React.FunctionComponent<VisitLinkDetailsProps> = ({
  taskConfig,
}) => {
  const messages = useMessages(messageIds);

  return (
    <TaskProperty
      title={messages.configs.visitLink.fields.url()}
      url
      value={taskConfig.url}
    />
  );
};

export default VisitLinkDetails;
