import { Msg } from 'core/i18n';
import {
  OPERATION,
  PersonViewFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import { useNumericRouteParams } from 'core/hooks';
import useViewTree from 'features/views/hooks/useViewTree';
const localMessageIds = messageIds.filters.personView;

interface DisplayPersonViewProps {
  filter: SmartSearchFilterWithId<PersonViewFilterConfig>;
}

const DisplayPersonView = ({ filter }: DisplayPersonViewProps): JSX.Element => {
  const { config } = filter;
  const { orgId } = useNumericRouteParams();
  const viewTree = useViewTree(orgId);
  const personViews = viewTree.data?.views ?? [];

  const view = personViews.find((v) => v.id == config.view);
  const operator = config.operator;

  const op = filter.op || OPERATION.ADD;

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        inSelect: <UnderlinedMsg id={localMessageIds.inSelect[operator]} />,
        viewSelect: <UnderlinedText text={view?.title || ''} />,
      }}
    />
  );
};

export default DisplayPersonView;
