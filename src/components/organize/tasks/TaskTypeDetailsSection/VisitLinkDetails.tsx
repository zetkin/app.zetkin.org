import TaskProperty from '../TaskProperty';
import { useIntl } from 'react-intl';
import { VisitLinkConfig } from 'types/tasks';

interface VisitLinkDetailsProps {
  taskConfig: Partial<VisitLinkConfig>;
}

const VisitLinkDetails: React.FunctionComponent<VisitLinkDetailsProps> = ({
  taskConfig,
}) => {
  const intl = useIntl();

  return (
    <TaskProperty
      title={intl.formatMessage({
        id: 'misc.tasks.forms.visitLinkConfig.fields.url',
      })}
      value={taskConfig.url}
    />
  );
};

export default VisitLinkDetails;
