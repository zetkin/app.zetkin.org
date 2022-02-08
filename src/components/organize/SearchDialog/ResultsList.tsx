/* eslint-disable react/display-name */
import { FunctionComponent } from 'react';
import Link from 'next/link';
import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';

import { MINIMUM_CHARACTERS } from '.';
import { SEARCH_DATA_TYPE, SearchResult } from 'pages/api/search';

interface ResultsListProps {
  searchQuery: string;
  results: SearchResult[];
  loading: boolean;
}

const ResultsList: FunctionComponent<ResultsListProps> = ({
  searchQuery,
  results,
  loading,
}): JSX.Element => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

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
              {results.map((result) => {
                // Show more results if the user clicks the show more button
                if (result.type === SEARCH_DATA_TYPE.PERSON) {
                  return (
                    <Link
                      key={result.match.id}
                      href={`/organize/${orgId}/people/${result.match.id}`}
                      passHref
                    >
                      <ListItem button component="a">
                        <ListItemAvatar>
                          <Avatar
                            src={`/api/orgs/${orgId}/people/${result.match.id}/avatar`}
                          />
                        </ListItemAvatar>
                        <ListItemText>
                          {result.match.first_name} {result.match.last_name}
                        </ListItemText>
                      </ListItem>
                    </Link>
                  );
                }
                if (result.type === SEARCH_DATA_TYPE.CAMPAIGN) {
                  return (
                    <Link
                      key={result.match.id}
                      href={`/organize/${orgId}/campaigns/${result.match.id}`}
                      passHref
                    >
                      <ListItem button component="a">
                        <ListItemText>{result.match.title}</ListItemText>
                      </ListItem>
                    </Link>
                  );
                }
                if (result.type === SEARCH_DATA_TYPE.TASK) {
                  return (
                    <Link
                      key={result.match.id}
                      href={`/organize/${orgId}/campaigns/${result.match.campaign.id}/calendar/tasks/${result.match.id}`}
                      passHref
                    >
                      <ListItem button component="a">
                        <ListItemText>{result.match.title}</ListItemText>
                      </ListItem>
                    </Link>
                  );
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
