import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';
import { Msg } from 'core/i18n';
import {
  OPERATION,
  PersonFieldFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useCustomFields from 'features/smartSearch/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
const localMessageIds = messageIds.filters.personField;

interface DisplayPersonFieldProps {
  filter: SmartSearchFilterWithId<PersonFieldFilterConfig>;
}

const DisplayPersonField = ({
  filter,
}: DisplayPersonFieldProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const fields = useCustomFields(orgId);
  const { config } = filter;
  const { field: slug, search } = config;
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const getField = (slug?: string) => fields.find((f) => f.slug === slug);
  const field = getField(slug);

  const fieldType = field?.type || '';
  if (fieldType != 'date' && fieldType != 'text' && fieldType != 'url') {
    // TODO:
    return <></>;
  }

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        field:
          fieldType == 'date' ? (
            <Msg
              id={localMessageIds.preview.date}
              values={{
                fieldName: <UnderlinedText text={field?.title ?? ''} />,
                timeFrame: <DisplayTimeFrame config={timeFrame} />,
              }}
            />
          ) : (
            <Msg
              id={localMessageIds.preview[fieldType]}
              values={{
                fieldName: <UnderlinedText text={field?.title ?? ''} />,
                searchTerm: <UnderlinedText text={search || ''} />,
              }}
            />
          ),
      }}
    />
  );
};

export default DisplayPersonField;
