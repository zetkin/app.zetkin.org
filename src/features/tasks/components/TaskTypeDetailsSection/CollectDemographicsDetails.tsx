import { CollectDemographicsConfig } from 'features/tasks/components/types';
import TaskProperty from '../TaskProperty';
import { useMessages } from 'core/i18n';

import messageIds from 'features/tasks/l10n/messageIds';

interface CollectDemographicsDetailsProps {
  taskConfig: Partial<CollectDemographicsConfig>;
}

const CollectDemographicsDetails: React.FunctionComponent<
  CollectDemographicsDetailsProps
> = ({ taskConfig }) => {
  const messages = useMessages(messageIds);

  const fieldMessages = {
    city: 'city',
    country: 'country',
    email: 'email',
    street_address: 'streetAddress',
    zip_code: 'zipCode',
  } as const;

  return (
    <TaskProperty
      title={messages.configs.collectDemographics.fields.demographic()}
      value={
        taskConfig.fields &&
        taskConfig.fields.length &&
        messages.configs.collectDemographics.fields.dempographicOptions[
          fieldMessages[taskConfig.fields[0]]
        ]()
      }
    />
  );
};

export default CollectDemographicsDetails;
