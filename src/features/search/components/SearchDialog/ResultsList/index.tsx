import { FunctionComponent } from 'react';

import { List, ListItem, ListItemText } from '@mui/material';

import CallAssignmentListItem from './CallAssignmentListItem';
import CampaignListItem from './CampaignListItem';
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
import { Msg } from 'core/i18n';

interface ResultsListProps {
  isLoading: boolean;
  queryString: string;
  results: SearchResult[];
}

const ResultsList: FunctionComponent<ResultsListProps> = ({
  isLoading,
  queryString,
  results,
}): JSX.Element => {
  if (queryString.length > 2 && !isLoading) {
    return (
      <List>
        {/* If results empty */}
        {results.length === 0 && queryString.length > 2 && (
          <ListItem>
            <ListItemText>
              <Msg id={messages.noResults} />
            </ListItemText>
          </ListItem>
        )}
        {/* If results */}
        {results.length > 0 && (
          <>
            {results.slice(0, 6).map((result) => {
              if (result.type === SEARCH_DATA_TYPE.PERSON) {
                return <PersonListItem person={result.match} />;
              }
              if (result.type === SEARCH_DATA_TYPE.CAMPAIGN) {
                return <CampaignListItem campaign={result.match} />;
              }
              if (result.type === SEARCH_DATA_TYPE.TASK) {
                return <TaskListItem task={result.match} />;
              }
              if (result.type === SEARCH_DATA_TYPE.CALL_ASSIGNMENT) {
                return <CallAssignmentListItem callAssignment={result.match} />;
              }
              if (result.type === SEARCH_DATA_TYPE.SURVEY) {
                return <SurveyListItem survey={result.match} />;
              }
              if (result.type === SEARCH_DATA_TYPE.VIEW) {
                return <ViewListItem view={result.match} />;
              }
              if (result.type === SEARCH_DATA_TYPE.JOURNEY_INSTANCE) {
                return (
                  <JourneyInstanceListItem journeyInstance={result.match} />
                );
              }
            })}
          </>
        )}
      </List>
    );
  }
  return null;
};

export default ResultsList;
