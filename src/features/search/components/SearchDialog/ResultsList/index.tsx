import { FunctionComponent } from 'react';

import { List, ListItem, ListItemText } from '@mui/material';

import CampaignListItem from './CampaignListItem';
import PersonListItem from './PersonListItem';
import TaskListItem from './TaskListItem';
import ViewListItem from './ViewListItem';
import {
  SEARCH_DATA_TYPE,
  SearchResult,
} from 'features/search/components/types';

import messages from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

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
            if (result.type === SEARCH_DATA_TYPE.VIEW) {
              return <ViewListItem view={result.match} />;
            }
          })}
        </>
      )}
    </List>
  );
};

export default ResultsList;
