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
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
const localMessageIds = messageIds.filters.personField;

interface DisplayPersonFieldProps {
  filter: SmartSearchFilterWithId<PersonFieldFilterConfig>;
}

const DisplayPersonField = ({
  filter,
}: DisplayPersonFieldProps): JSX.Element | null => {
  const { orgId } = useNumericRouteParams();
  const fields = useCustomFields(orgId).data ?? [];
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
  if (
    fieldType != 'date' &&
    fieldType != 'text' &&
    fieldType != 'url' &&
    fieldType != 'enum'
  ) {
    // TODO:
    return null;
  }
  let fieldMessage;
  if (fieldType == 'date') {
    fieldMessage = (
      <Msg
        id={localMessageIds.preview.date}
        values={{
          fieldName: <UnderlinedText text={field?.title ?? ''} />,
          timeFrame: <DisplayTimeFrame config={timeFrame} />,
        }}
      />
    );
  } else if (
    fieldType == 'enum' &&
    field?.enum_choices &&
    search !== undefined
  ) {
    fieldMessage = (
      <Msg
        id={localMessageIds.preview[fieldType]}
        values={{
          fieldName: <UnderlinedText text={field?.title ?? ''} />,
          searchTerm: (
            <UnderlinedText
              text={
                field?.enum_choices.find((c) => c.key == search)?.label ||
                search
              }
            />
          ),
        }}
      />
    );
  } else {
    fieldMessage = (
      <Msg
        id={localMessageIds.preview[fieldType]}
        values={{
          fieldName: <UnderlinedText text={field?.title ?? ''} />,
          searchTerm: <UnderlinedText text={search || ''} />,
        }}
      />
    );
  }
  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        field: fieldMessage,
      }}
    />
  );
};

export default DisplayPersonField;
