import { FunctionComponent } from 'react';

import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
} from '@material-ui/core';

interface PersonSearchResult {
    alt_phone: string;
    is_user: boolean;
    zip_code: string; // Need to check
    last_name: string;
    city: null; // Need to check
    first_name: string;
    gender: 'm'; // Check gender options
    street_address: null; // Need to check
    co_address: null; // Need to check
    ext_id: null; // Str or num
    email: string;
    country: null; // Check
    id: number;
    phone: string;
}

interface ResultsListProps {
    searchFieldValue: string;
    results: PersonSearchResult[];
}

const ResultsList: FunctionComponent<ResultsListProps> = ({ searchFieldValue }): JSX.Element => {
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
                    <List
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                People
                            </ListSubheader>
                        }>
                        <ListItem button component="a">
                            <ListItemAvatar>
                                <Avatar />
                            </ListItemAvatar>
                            <ListItemText>Richard</ListItemText>
                        </ListItem>
                    </List>
                </>
            ) }
        </List>
    );
};

export default ResultsList;
