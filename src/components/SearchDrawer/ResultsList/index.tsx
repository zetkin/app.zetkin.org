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
