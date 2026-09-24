import { FunctionComponent, useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';

import CallAssignmentListItem from './CallAssignmentListItem';
import ProjectListItem from './ProjectListItem';
import JourneyInstanceListItem from './JourneyInstanceListItem';
import PersonListItem from './PersonListItem';
import SurveyListItem from './SurveyListItem';
import TaskListItem from './TaskListItem';
import ViewListItem from './ViewListItem';
import {
  SEARCH_DATA_TYPE,
  SearchResult,
} from 'features/search/components/types';
import messages from '../../../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

// How many results each group shows before it is expanded, and by how much
const INITIAL_PER_GROUP = 3;
const STEP = 5;

// Groups appear in this order, whichever of them have results
const GROUP_ORDER = [
  SEARCH_DATA_TYPE.PERSON,
  SEARCH_DATA_TYPE.VIEW,
  SEARCH_DATA_TYPE.PROJECT,
  SEARCH_DATA_TYPE.SURVEY,
  SEARCH_DATA_TYPE.TASK,
  SEARCH_DATA_TYPE.CALL_ASSIGNMENT,
  SEARCH_DATA_TYPE.JOURNEY_INSTANCE,
];

interface ResultsListProps {
  /** What was searched for, so that a new search collapses the groups again */
  query: string;
  results: SearchResult[];
}

const ResultsList: FunctionComponent<ResultsListProps> = ({
  query,
  results,
}): JSX.Element => {
  const msg = useMessages(messages);
  const [shownPerGroup, setShownPerGroup] = useState<
    Partial<Record<SEARCH_DATA_TYPE, number>>
  >({});

  // A new search starts every group collapsed again
  useEffect(() => {
    setShownPerGroup({});
  }, [query]);

  const groups = GROUP_ORDER.map((type) => ({
    items: results.filter((result) => result.type === type),
    type,
  })).filter((group) => group.items.length > 0);

  const showMore = (type: SEARCH_DATA_TYPE) =>
    setShownPerGroup((current) => ({
      ...current,
      [type]: (current[type] ?? INITIAL_PER_GROUP) + STEP,
    }));

  return (
    <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
      {groups.length === 0 && (
        <ListItem>
          <ListItemText>
            <Msg id={messages.noResults} />
          </ListItemText>
        </ListItem>
      )}
      {groups.map(({ items, type }) => {
        const shown = shownPerGroup[type] ?? INITIAL_PER_GROUP;

        return [
          <ListSubheader key={`header-${type}`} disableSticky>
            {msg.groups[type]()}
          </ListSubheader>,
          ...items.slice(0, shown).map(renderResult),
          items.length > shown ? (
            <ListItem key={`more-${type}`} disablePadding>
              <ListItemButton
                data-testid={`SearchDialog-showMore-${type}`}
                onClick={() => showMore(type)}
              >
                <Typography color="primary" variant="body2">
                  <Msg id={messages.showMore} />
                </Typography>
              </ListItemButton>
            </ListItem>
          ) : null,
        ];
      })}
    </List>
  );
};

function renderResult(result: SearchResult) {
  if (result.type === SEARCH_DATA_TYPE.PERSON) {
    return <PersonListItem key={result.match.id} person={result.match} />;
  }
  if (result.type === SEARCH_DATA_TYPE.PROJECT) {
    return <ProjectListItem key={result.match.id} project={result.match} />;
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
    return <SurveyListItem key={result.match.id} survey={result.match} />;
  }
  if (result.type === SEARCH_DATA_TYPE.VIEW) {
    return <ViewListItem key={result.match.id} view={result.match} />;
  }

  return (
    <JourneyInstanceListItem
      key={result.match.id}
      journeyInstance={result.match}
    />
  );
}

export default ResultsList;
