import { FormattedMessage as Msg } from 'react-intl';
import { List, ListItem, ListItemText } from '@material-ui/core';
import React, { useState } from 'react';

interface ZetkinListProps {
    initialLength?: number;
    showMoreStep?: number;
}

/**
 * Pass in all items to display as children. If you want to make a complicated list with internal lists,
 * this is likely not the best solution. Use an MUI List directly.
 *
 * Props:
 *
 * `initialLength?` - If not set, shows all items. If set, shows this many items and a
 * "show more" button if there are more items to display.
 *
 * `showMoreStep?` - If `initialLength` is set, this sets how many more items are shown when
 * clicking the "show more" button. Default is 5.
 */
const ZetkinList: React.FunctionComponent<ZetkinListProps> = ({ children, initialLength, showMoreStep }) => {
    const childrenArray = Array.isArray(children) ? children : [children];
    const [numResultsToDisplay, setNumResultsToDisplay] = useState(initialLength || childrenArray.length);

    return (
        <List
            disablePadding>
            { childrenArray.map((child, index) => {
                // Show more results if the user clicks the show more button
                if (index < numResultsToDisplay)
                    return child;
            }) }
            { childrenArray.length > numResultsToDisplay && (
                <ListItem button component="a" onClick={ () => {
                    setNumResultsToDisplay(numResultsToDisplay + (showMoreStep || 5));
                } }>
                    <ListItemText>
                        <Msg id="layout.organize.search.showMore" />
                    </ListItemText>
                </ListItem>
            ) }
        </List>
    );
};

export default ZetkinList;
