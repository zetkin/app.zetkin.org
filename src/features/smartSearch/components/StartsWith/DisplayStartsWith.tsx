import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.all;

interface DisplayStartsWithProps {
  startsWithAll: boolean;
}

const DisplayStartsWith = ({
  startsWithAll,
}: DisplayStartsWithProps): JSX.Element => {
  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        startWithSelect: (
          <Msg
            id={
              localMessageIds.startWithSelect[startsWithAll ? 'true' : 'false']
            }
          />
        ),
      }}
    />
  );
};

export default DisplayStartsWith;
