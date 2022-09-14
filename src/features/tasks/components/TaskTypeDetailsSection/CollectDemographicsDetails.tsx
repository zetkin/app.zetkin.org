import { CollectDemographicsConfig } from 'features/tasks/components/types';
import TaskProperty from '../TaskProperty';
import { useIntl } from 'react-intl';

interface CollectDemographicsDetailsProps {
  taskConfig: Partial<CollectDemographicsConfig>;
}

const CollectDemographicsDetails: React.FunctionComponent<
  CollectDemographicsDetailsProps
> = ({ taskConfig }) => {
  const intl = useIntl();

  return (
    <TaskProperty
      title={intl.formatMessage({
        id: 'misc.tasks.forms.collectDemographicsConfig.fields.demographicField',
      })}
      value={
        taskConfig.fields &&
        taskConfig.fields.length &&
        intl.formatMessage({
          id: `misc.tasks.forms.collectDemographicsConfig.fields.demographicFieldOptions.${taskConfig.fields[0]}`,
        })
      }
    />
  );
};

export default CollectDemographicsDetails;
