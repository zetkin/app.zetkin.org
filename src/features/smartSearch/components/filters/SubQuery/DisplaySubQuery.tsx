import type { JSX } from 'react';

import { ZetkinQuery } from 'utils/types/zetkin';
import {
  OPERATION,
  QUERY_TYPE,
  SmartSearchFilterWithId,
  SubQueryFilterConfig,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useCallAssignments from 'features/callAssignments/hooks/useCallAssignments';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchQueries from 'features/smartSearch/hooks/useSmartSearchQueries';
import useEmails from 'features/emails/hooks/useEmails';

const localMessageIds = messageIds.filters.subQuery;

interface DisplaySubQueryProps {
  filter: SmartSearchFilterWithId<SubQueryFilterConfig>;
}

const DisplaySubQuery = ({ filter }: DisplaySubQueryProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const queriesFuture = useSmartSearchQueries(orgId);
  const standaloneQueries = queriesFuture.data || [];

  const assignmentsFuture = useCallAssignments(orgId);
  const assignments = assignmentsFuture.data || [];

  const targetGroupQueriesWithTitles: ZetkinQuery[] = assignments.map((a) => ({
    ...a.target,
    title: a.title,
  }));

  const purposeGroupQueriesWithTitles: ZetkinQuery[] = assignments.map((a) => ({
    ...a.goal,
    title: a.title,
  }));

  const emailsFuture = useEmails(orgId);
  const emails = emailsFuture.data || [];

  const emailTargetQueriesWithTitles: ZetkinQuery[] = emails.map((e) => ({
    ...e.target,
    title: e.title || undefined,
    type: QUERY_TYPE.EMAIL_TARGET,
  }));

  const { query_id } = config;

  const op = filter.op || OPERATION.ADD;

  const query =
    standaloneQueries.find((q) => q.id === query_id) ||
    targetGroupQueriesWithTitles.find((q) => q.id === query_id) ||
    purposeGroupQueriesWithTitles.find((q) => q.id === query_id) ||
    emailTargetQueriesWithTitles.find((q) => q.id === query_id);

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        matchSelect: (
          <UnderlinedMsg
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
