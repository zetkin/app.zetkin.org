/* eslint-disable react/display-name */
import Link from 'next/link';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { FunctionComponent, useEffect, useState } from 'react';

import Search from '@material-ui/icons/Search';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';

import getOrg from 'fetching/getOrg';
import { MINIMUM_CHARACTERS } from '.';
import { noPropagate } from 'utils';
import { ZetkinPerson } from 'types/zetkin';

interface ResultsListProps {
  searchFieldValue: string;
  results: ZetkinPerson[];
  loading: boolean;
  orgId: string;
}

const ResultsList: FunctionComponent<ResultsListProps> = ({
  searchFieldValue,
  results,
  loading,
  orgId,
}): JSX.Element => {
  const [numResultsToDisplay, setNumResultsToDisplay] = useState<number>(5);
  const { data: org } = useQuery(['org', orgId], getOrg(orgId), {
    enabled: false,
  });

  // If results change, reset the max number back to 5
  useEffect(() => {
    setNumResultsToDisplay(5);
  }, [results]);

  return (
    <List>
      {/* Typing prompts */}
      {searchFieldValue.length === 0 && (
        <ListItem>
          <ListItemText>
            <Msg id="layout.organize.search.startTypingPrompt" />
          </ListItemText>
        </ListItem>
      )}
      {searchFieldValue.length > 0 &&
        searchFieldValue.length < MINIMUM_CHARACTERS && (
          <ListItem>
            <ListItemText>
              <Msg id="layout.organize.search.keepTypingPrompt" />
            </ListItemText>
          </ListItem>
        )}
      {/* Results */}
      {searchFieldValue.length >= MINIMUM_CHARACTERS && (
        <>
          <Link
            href={{
              pathname: `/organize/${orgId}/search`,
              query: { q: encodeURIComponent(searchFieldValue) },
            }}
            passHref
          >
            <ListItem button component="a">
              <ListItemAvatar>
                <Search />
              </ListItemAvatar>
              <ListItemText>
                <Msg
                  id="layout.organize.search.seeAllResultsInOrg"
                  values={{
                    b: (word: string) => <b>{word}</b>,
                    orgName: `${org?.title}`,
                    searchQuery: searchFieldValue,
                  }}
                />
              </ListItemText>
            </ListItem>
          </Link>
          {/* People List */}
          <List
            area-label="people"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                <Msg id="layout.organize.search.peopleListSubheader" />
              </ListSubheader>
            }
          >
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
                {results.map((person, index) => {
                  // Show more results if the user clicks the show more button
                  if (index < numResultsToDisplay)
                    return (
                      <Link
                        key={person.id}
                        href={`/organize/${orgId}/people/${person.id}`}
                        passHref
                      >
                        <ListItem button component="a">
                          <ListItemAvatar>
                            <Avatar
                              src={`/api/orgs/${orgId}/people/${person.id}/avatar`}
                            />
                          </ListItemAvatar>
                          <ListItemText>
                            {person.first_name} {person.last_name}
                          </ListItemText>
                        </ListItem>
                      </Link>
                    );
                })}
              </>
            )}
            {/* Show more button */}
            {results.length > numResultsToDisplay && (
              <ListItem>
                <ListItemText>
                  <Button
                    onClick={noPropagate(() =>
                      setNumResultsToDisplay(numResultsToDisplay + 5)
                    )}
                  >
                    <Msg id="layout.organize.search.showMore" />
                  </Button>
                </ListItemText>
              </ListItem>
            )}
          </List>
        </>
      )}
    </List>
  );
};

export default ResultsList;
