/* eslint-disable react/display-name */
import { FunctionComponent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import { List, ListItem, ListItemText } from '@material-ui/core';

import CampaignListItem from './CampaignListItem';
import PersonListItem from './PersonListItem';
import TaskListItem from './TaskListItem';
import {
  SEARCH_DATA_TYPE,
  SearchResult,
} from 'features/search/components/search';

interface ResultsListProps {
  results: SearchResult[];
}

const ResultsList: FunctionComponent<ResultsListProps> = ({
  results,
}): JSX.Element => {
  return (
    <List>
      {/* If results empty */}
      {results.length === 0 && (
        <ListItem>
          <ListItemText>
            <Msg id="layout.organize.search.noResults" />
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
          })}
        </>
      )}
    </List>
  );
};

export default ResultsList;
