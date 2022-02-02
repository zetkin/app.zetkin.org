import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getAllCallAssignments from 'fetching/getAllCallAssignments';
import getStandaloneQueries from 'fetching/getStandaloneQueries';
import { ZetkinQuery } from 'types/zetkin';
import {
  OPERATION,
  SmartSearchFilterWithId,
  SubQueryFilterConfig,
} from 'types/smartSearch';

interface DisplaySubQueryProps {
  filter: SmartSearchFilterWithId<SubQueryFilterConfig>;
}

const DisplaySubQuery = ({ filter }: DisplaySubQueryProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const standaloneQuery = useQuery(
    ['standaloneQueries', orgId],
    getStandaloneQueries(orgId as string)
  );
  const standaloneQueries = standaloneQuery?.data || [];
  const assignmentsQuery = useQuery(
    ['assignments', orgId],
    getAllCallAssignments(orgId as string)
  );
  const assignments = assignmentsQuery?.data || [];

  const targetGroupQueriesWithTitles: ZetkinQuery[] = assignments.map((a) => ({
    ...a.target,
    title: a.title,
  }));

  const purposeGroupQueriesWithTitles: ZetkinQuery[] = assignments.map((a) => ({
    ...a.goal,
    title: a.title,
  }));

  const { query_id } = config;

  const op = filter.op || OPERATION.ADD;

  const query =
    standaloneQueries.find((q) => q.id === query_id) ||
    targetGroupQueriesWithTitles.find((q) => q.id === query_id) ||
    purposeGroupQueriesWithTitles.find((q) => q.id === query_id);

  return (
    <Msg
      id="misc.smartSearch.sub_query.inputString"
      values={{
        addRemoveSelect: (
          <Msg id={`misc.smartSearch.sub_query.addRemoveSelect.${op}`} />
        ),
        query: (
          <Msg
            id={`misc.smartSearch.query.preview.${query?.type || 'none'}`}
            values={{
              queryTitle: query?.title,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplaySubQuery;
