import { FunctionComponent } from 'react';

import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
} from '@material-ui/core';

import { ZetkinPerson } from '../../../types/zetkin';


interface ResultsListProps {
    searchFieldValue: string;
    results: ZetkinPerson[];
    loading: boolean;
}

const ResultsList: FunctionComponent<ResultsListProps> = ({ searchFieldValue, results, loading }): JSX.Element => {
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
                    <ListItem button component="a">
                        <ListItemText>
                            See all results for &quot;{ searchFieldValue }&quot;
                        </ListItemText>
                    </ListItem>
                    { /* People List */ }
                    <List
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                People
                            </ListSubheader>
                        }>
                        { /* Loading indicator */ }
                        {
                            loading && (
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
                            !loading && results.length > 0 && (
                                <>
                                    { results.map((person) => (
                                        <ListItem key={ person.id } button component="a">
                                            <ListItemAvatar>
                                                <Avatar></Avatar>
                                            </ListItemAvatar>
                                            <ListItemText>
                                                { person.first_name } { person.last_name }
                                            </ListItemText>
                                        </ListItem>
                                    )) }
                                </>

                            )
                        }

                    </List>
                </>
            ) }
        </List>
    );
};

export default ResultsList;
