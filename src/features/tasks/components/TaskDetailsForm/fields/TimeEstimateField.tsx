import { useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';
import ZUISelect from '../../../../../zui/components/ZUISelect';

type Props = {
  onChange: (value: number | null) => void;
  value: number | null;
};

const DEFAULT_TIME_ESTIMATE = 'noEstimate';

const toHoursAndMinutes = (minutes: number) => ({
  hours: Math.floor(minutes / 60),
  minutes: minutes % 60,
});

const TimeEstimateField: React.FunctionComponent<Props> = ({
  value,
  onChange,
}) => {
  const messages = useMessages(messageIds);
  const internalValue =
    value === null ? DEFAULT_TIME_ESTIMATE : value.toString();

  const allowedValues = [1, 3, 5, 10, 15, 30, 45, 60, 90, 120];

  return (
    <ZUISelect
      fullWidth
      items={[
        {
          label: messages.form.fields.timeEstimateOptions.noEstimate(),
          value: DEFAULT_TIME_ESTIMATE,
        },
        {
          label: messages.form.fields.timeEstimateOptions.lessThanOneMinute(),
          value: '0',
        },
        ...allowedValues.map((minutes) => ({
          label: messages.form.fields.timeEstimateOptions.hoursAndMinutes(
            toHoursAndMinutes(minutes)
          ),
          value: minutes.toString(),
        })),
      ]}
      label={messages.form.fields.timeEstimate()}
      onChange={(value) =>
        onChange(value === DEFAULT_TIME_ESTIMATE ? null : parseInt(value))
      }
      selectedOption={internalValue}
      size="large"
    />
  );
};

export default TimeEstimateField;
