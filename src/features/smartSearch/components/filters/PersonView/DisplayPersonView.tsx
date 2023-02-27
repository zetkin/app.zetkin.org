import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getViews from 'features/smartSearch/fetching/getViews';
import { Msg } from 'core/i18n';
import {
  OPERATION,
  PersonViewFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.personView;

interface DisplayPersonViewProps {
  filter: SmartSearchFilterWithId<PersonViewFilterConfig>;
}

const DisplayPersonView = ({ filter }: DisplayPersonViewProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;

  const personViewsQuery = useQuery(
    ['personviews', orgId],
    getViews(orgId as string)
  );
  const personViews = personViewsQuery?.data || [];

  const view = personViews.find((v) => v.id == config.view) || personViews[0];
  const operator = config.operator;

  const op = filter.op || OPERATION.ADD;

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        inSelect: <Msg id={localMessageIds.inSelect[operator]} />,
        viewSelect: view.title,
      }}
    />
  );
};

export default DisplayPersonView;
