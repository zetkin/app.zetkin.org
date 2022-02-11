/* eslint-disable react/display-name */
import { FunctionComponent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import { List, ListItem, ListItemText } from '@material-ui/core';

import CampaignListItem from './CampaignListItem';
import { MINIMUM_CHARACTERS } from '..';
import PersonListItem from './PersonListItem';
import TaskListItem from './TaskListItem';
import { SEARCH_DATA_TYPE, SearchResult } from 'types/search';

interface ResultsListProps {
  searchQuery: string;
  results: SearchResult[];
  loading: boolean;
  error: boolean;
}

const ResultsList: FunctionComponent<ResultsListProps> = ({
  searchQuery,
  results,
  loading,
  error,
}): JSX.Element => {
  return (
    <List>
      {/* Typing prompts */}
      {searchQuery.length === 0 && (
        <ListItem>
          <ListItemText>
            <Msg id="layout.organize.search.startTypingPrompt" />
          </ListItemText>
        </ListItem>
      )}
      {searchQuery.length > 0 && searchQuery.length < MINIMUM_CHARACTERS && (
        <ListItem>
          <ListItemText>
            <Msg id="layout.organize.search.keepTypingPrompt" />
          </ListItemText>
        </ListItem>
      )}
      {/* Results */}
      {searchQuery.length >= MINIMUM_CHARACTERS && (
        <>
          {/* Loading indicator */}
          {loading && results.length == 0 && (
            <ListItem>
              <ListItemText>
                <Msg id="layout.organize.search.loading" />
              </ListItemText>
            </ListItem>
          )}
          {/* Loading indicator */}
          {error && results.length == 0 && (
            <ListItem>
              <ListItemText>
                <Msg id="layout.organize.search.error" />
              </ListItemText>
            </ListItem>
          )}
          {/* If results empty */}
          {!loading && results.length === 0 && (
            <ListItem>
              <ListItemText>
                <Msg id="layout.organize.search.noResults" />
              </ListItemText>
            </ListItem>
          )}
          {/* People */}
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
              })}
            </>
          )}
        </>
      )}
    </List>
  );
};

export default ResultsList;
