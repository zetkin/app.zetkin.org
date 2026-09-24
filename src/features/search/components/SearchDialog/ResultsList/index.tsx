import { FunctionComponent, useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

import CallAssignmentListItem from './CallAssignmentListItem';
import ProjectListItem from './ProjectListItem';
import JourneyInstanceListItem from './JourneyInstanceListItem';
import PersonListItem from './PersonListItem';
import SurveyListItem from './SurveyListItem';
import TaskListItem from './TaskListItem';
import ShowMoreItem from './ShowMoreItem';
import ViewListItem from './ViewListItem';
import {
  SEARCH_DATA_TYPE,
  SearchResult,
} from 'features/search/components/types';
import messages from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

// How many results are listed before the user asks for more
const PAGE_SIZE = 6;

/**
 * The API returns at most 20 hits per data type, so a type that comes back
 * full has almost certainly been truncated.
 */
const API_CAP_PER_TYPE = 20;

interface ResultsListProps {
  /** What was searched for, so that a new search collapses the list again */
  query: string;
  results: SearchResult[];
}

const ResultsList: FunctionComponent<ResultsListProps> = ({
  query,
  results,
}): JSX.Element => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // A new search starts from the top again
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query]);

  const countsByType = results.reduce<Record<string, number>>(
    (counts, result) => ({
      ...counts,
      [result.type]: (counts[result.type] || 0) + 1,
    }),
    {}
  );
  const capped = Object.values(countsByType).some(
    (count) => count >= API_CAP_PER_TYPE
  );
  const remaining = Math.max(results.length - visibleCount, 0);

  return (
    <List
      sx={{
        maxHeight: '60vh',
        overflowY: 'auto',
      }}
    >
      {/* If results empty */}
      {results.length === 0 && (
        <ListItem>
          <ListItemText>
            <Msg id={messages.noResults} />
          </ListItemText>
        </ListItem>
      )}
      {/* If results */}
      {results.length > 0 && (
        <>
          {results.slice(0, visibleCount).map((result) => {
            if (result.type === SEARCH_DATA_TYPE.PERSON) {
              return (
                <PersonListItem key={result.match.id} person={result.match} />
              );
            }
            if (result.type === SEARCH_DATA_TYPE.PROJECT) {
              return (
                <ProjectListItem key={result.match.id} project={result.match} />
              );
            }
            if (result.type === SEARCH_DATA_TYPE.TASK) {
              return <TaskListItem key={result.match.id} task={result.match} />;
            }
            if (result.type === SEARCH_DATA_TYPE.CALL_ASSIGNMENT) {
              return (
                <CallAssignmentListItem
                  key={result.match.id}
                  callAssignment={result.match}
                />
              );
            }
            if (result.type === SEARCH_DATA_TYPE.SURVEY) {
              return (
                <SurveyListItem key={result.match.id} survey={result.match} />
              );
            }
            if (result.type === SEARCH_DATA_TYPE.VIEW) {
              return <ViewListItem key={result.match.id} view={result.match} />;
            }
            if (result.type === SEARCH_DATA_TYPE.JOURNEY_INSTANCE) {
              return (
                <JourneyInstanceListItem
                  key={result.match.id}
                  journeyInstance={result.match}
                />
              );
            }
          })}
          <ShowMoreItem
            capped={capped}
            onShowMore={() => setVisibleCount((current) => current + PAGE_SIZE)}
            step={Math.min(remaining, PAGE_SIZE)}
            total={results.length}
          />
        </>
      )}
    </List>
  );
};

export default ResultsList;
