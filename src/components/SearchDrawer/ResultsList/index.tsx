import { FunctionComponent } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';

import Search from '@material-ui/icons/Search';
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
} from '@material-ui/core';

import getOrg from '../../../fetching/getOrg';
import { ZetkinPerson } from '../../../types/zetkin';


interface ResultsListProps {
    searchFieldValue: string;
    results: ZetkinPerson[];
    loading: boolean;
    orgId: string;
}

const ResultsList: FunctionComponent<ResultsListProps> = ({ searchFieldValue, results, loading, orgId }): JSX.Element => {
    const { data: org } = useQuery(['org', orgId], getOrg(orgId));

    return (
        <List>
            { /* Keep typing prompts */ }
            { searchFieldValue.length === 0 && (
                <ListItem>
                    <ListItemText>
                        Start typing to search.
                    </ListItemText>
                </ListItem>
            ) }
            { searchFieldValue.length > 0 && searchFieldValue.length < 3 && (
                <ListItem>
                    <ListItemText>
                        Keep typing to search.
                    </ListItemText>
                </ListItem>
            ) }
            { /* Results */ }
            { searchFieldValue.length >= 3 && (
                <>
                    <Link
                        href={{
                            pathname: `/organize/${orgId}/search`,
                            query: { q: encodeURIComponent(searchFieldValue) },
                        }}
                        passHref>
                        <ListItem button component="a">
                            <ListItemAvatar>
                                <Search />
                            </ListItemAvatar>
                            <ListItemText>
                                See all results in <b>{ org?.title }</b> for &quot;{ searchFieldValue }&quot;
                            </ListItemText>
                        </ListItem>
                    </Link>
                    { /* People List */ }
                    <List
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                People
                            </ListSubheader>
                        }>
                        { /* Loading indicator */ }
                        {
                            loading && results.length == 0 && (
                                <ListItem>
                                    <ListItemText>
                                        Loading...
                                    </ListItemText>
                                </ListItem>
                            )
                        }
                        { /* If results empty */ }
                        {
                            !loading && results.length === 0 && (
                                <ListItem>
                                    <ListItemText>
                                        No results
                                    </ListItemText>
                                </ListItem>
                            )
                        }
                        { /* If results */ }
                        {
                            results.length > 0 && (
                                <>
                                    { results.slice(0, 5).map((person) => (
                                        <Link key={ person.id } href={ `/organize/${orgId}/people/${person.id}` } passHref>
                                            <ListItem button component="a">
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={ `/api/orgs/${orgId}/people/${person.id}/avatar` }>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText>
                                                    { person.first_name } { person.last_name }
                                                </ListItemText>
                                            </ListItem>
                                        </Link>
                                    )) }
                                </>

                            )
                        }
                        <ListItem>
                            <ListItemText>
                                Show more...
                            </ListItemText>
                        </ListItem>
                    </List>
                </>
            ) }
        </List>
    );
};

export default ResultsList;
