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
import StyledMsg from '../../StyledMsg';
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

  const view = personViews.find((v) => v.id == config.view);
  const operator = config.operator;

  const op = filter.op || OPERATION.ADD;

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <StyledMsg id={localMessageIds.addRemoveSelect[op]} />,
        inSelect: <StyledMsg id={localMessageIds.inSelect[operator]} />,
        viewSelect: (
          <StyledMsg
            id={localMessageIds.styleMe}
            values={{ styleMe: view?.title || '' }}
          />
        ),
      }}
    />
  );
};

export default DisplayPersonView;
