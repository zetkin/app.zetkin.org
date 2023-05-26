import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getAllCallAssignments from 'features/callAssignments/api/getAllCallAssignments';
import getStandaloneQueries from 'utils/fetching/getStandaloneQueries';
import { ZetkinQuery } from 'utils/types/zetkin';
import {
  OPERATION,
  SmartSearchFilterWithId,
  SubQueryFilterConfig,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
const localMessageIds = messageIds.filters.subQuery;

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
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: (
          <StyledMsg id={messageIds.filters.subQuery.addRemoveSelect[op]} />
        ),
        matchSelect: (
          <StyledMsg
            id={
              messageIds.filters.subQuery.matchSelect[
                filter.config.operator || 'in'
              ]
            }
          />
        ),
        query: (
          <Msg
            id={localMessageIds.query.preview[query?.type || 'none']}
            values={{
              queryTitle: <UnderlinedText text={query?.title ?? ''} />,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplaySubQuery;
