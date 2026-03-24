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
import useOrgIdsFromOrgScope from 'features/smartSearch/hooks/useOrgIdsFromOrgScope';
import useSubOrgViews from 'features/views/hooks/useSubOrgViews';
const localMessageIds = messageIds.filters.personView;

interface DisplayPersonViewProps {
  filter: SmartSearchFilterWithId<PersonViewFilterConfig>;
}

const DisplayPersonView = ({ filter }: DisplayPersonViewProps): JSX.Element => {
  const { config } = filter;
  const { orgId } = useNumericRouteParams();
  const filterScope = filter.config.organizations || [orgId];

  const orgIds = useOrgIdsFromOrgScope(orgId, filterScope);
  const viewsFuture = useSubOrgViews(orgIds);
  const personViews = viewsFuture.data || [];

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
