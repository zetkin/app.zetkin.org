import { FunctionComponent } from 'react';
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

const PREVIEW_PER_GROUP = 3;

export const GROUP_ORDER = [
  SEARCH_DATA_TYPE.PERSON,
  SEARCH_DATA_TYPE.VIEW,
  SEARCH_DATA_TYPE.PROJECT,
  SEARCH_DATA_TYPE.SURVEY,
  SEARCH_DATA_TYPE.TASK,
  SEARCH_DATA_TYPE.CALL_ASSIGNMENT,
  SEARCH_DATA_TYPE.JOURNEY_INSTANCE,
];

interface ResultsListProps {
  onSelectType: (type: SEARCH_DATA_TYPE) => void;
  results: SearchResult[];
  selectedType: SEARCH_DATA_TYPE | null;
}

const ResultsList: FunctionComponent<ResultsListProps> = ({
  onSelectType,
  results,
  selectedType,
}): JSX.Element => {
  const msg = useMessages(messages);

  const groups = GROUP_ORDER.map((type) => ({
    items: results.filter((result) => result.type === type),
    type,
  })).filter((group) => group.items.length > 0);

  if (groups.length === 0) {
    return (
      <List>
        <ListItem>
          <ListItemText>
            <Msg id={messages.noResults} />
          </ListItemText>
        </ListItem>
      </List>
    );
  }

  return (
    <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
      {groups.map(({ items, type }) => {
        const expanded = selectedType === type;
        const shown = expanded ? items : items.slice(0, PREVIEW_PER_GROUP);

        return [
          expanded ? null : (
            <ListSubheader key={`header-${type}`} disableSticky>
              {msg.groups[type]()}
            </ListSubheader>
          ),
          ...shown.map(renderResult),
          items.length > shown.length ? (
            <ListItem key={`more-${type}`} disablePadding>
              <ListItemButton
                data-testid={`SearchDialog-showMore-${type}`}
                onClick={() => onSelectType(type)}
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Typography color="primary" variant="body2">
                      <Msg id={messages.showMore} />
                    </Typography>
                  }
                  sx={{ paddingLeft: 9 }}
                />
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
