import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getViews from 'features/smartSearch/fetching/getViews';
import {
  OPERATION,
  PersonViewFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

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

  const view = personViews.find((v) => v.id == config.view ) || personViews[0];
  const operator = config.operator;

  const op = filter.op || OPERATION.ADD;

  return (
    <Msg
      id="misc.smartSearch.person_view.inputString"
      values={{
        addRemoveSelect: (
          <Msg id={`misc.smartSearch.person_view.addRemoveSelect.${op}`} />
        ),
        inSelect: (
          <Msg
            id={`misc.smartSearch.person_view.inSelect.${operator}`}
          />
        ),
        viewSelect: view.title
      }}
    />
  );
};

export default DisplayPersonView;
