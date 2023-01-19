import Fuse from 'fuse.js';
import { Box, List, ListItem, TextField, Typography } from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import { FunctionComponent, useMemo, useRef, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { Theme, useMediaQuery } from '@mui/material';

import categories from '../categories';
import ChoiceCategories from './ChoiceCategories';
import SearchResults from './SearchResults';
import { ZetkinViewColumn } from 'features/views/components/types';
import choices, { ColumnChoice } from '../choices';

interface ColumnGalleryProps {
  existingColumns: ZetkinViewColumn[];
  onAdd: (choice: ColumnChoice) => void;
  onClose: () => void;
  onConfigure: (choice: ColumnChoice) => void;
}

const ColumnGallery: FunctionComponent<ColumnGalleryProps> = ({
  existingColumns,
  onAdd,
  onClose,
  onConfigure,
}) => {
  const intl = useIntl();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  const [isSearching, setIsSearching] = useState(false);
  const [searchString, setSearchString] = useState('');

  //list of objects with localized strings to use in the fuse-search
  const searchObjects = choices.map((choice) => ({
    description: intl.formatMessage({
      id: `misc.views.columnDialog.choices.${choice.key}.description`,
    }),
    key: choice.key,
    keywords: intl.formatMessage({
      id: `misc.views.columnDialog.choices.${choice.key}.keywords`,
    }),
    title: intl.formatMessage({
      id: `misc.views.columnDialog.choices.${choice.key}.title`,
    }),
  }));

  const search = () => {
    const fuse = new Fuse(searchObjects, {
      keys: ['description', 'keywords', 'title'],
      threshold: 0.4,
    });

    //get the keys from the search results
    const keys = fuse
      .search(searchString)
      .map((fuseResult) => fuseResult.item.key);

    //return the choice objects with matching keys
    return keys.map((key) => choices.find((choice) => choice.key === key));
  };

  const searchResults = useMemo(() => search(), [searchString]);

  const choiceContainerRef = useRef<HTMLDivElement>();

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" justifyContent="space-between" padding={2}>
        <Typography variant="h4">
          <Msg id="misc.views.columnDialog.gallery.columns" />
        </Typography>
        <Box alignItems="center" display="flex">
          <TextField
            InputProps={{
              endAdornment: <Search color="secondary" />,
            }}
            onChange={(evt) => {
              setSearchString(evt.target.value);
              if (evt.target.value === '') {
                setIsSearching(false);
                return;
              }
              setIsSearching(true);
            }}
            placeholder={intl.formatMessage({
              id: 'misc.views.columnDialog.gallery.searchPlaceholder',
            })}
            sx={{ paddingRight: 2 }}
            value={searchString}
            variant="outlined"
          />
          <Close
            color="secondary"
            fontSize="medium"
            onClick={() => onClose()}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      </Box>
      <Box display="flex" height="100%">
        <Box
          alignItems="center"
          display={isMobile ? 'none' : 'flex'}
          flexDirection="column"
          justifyContent="space-between"
          sx={{
            overflowY: 'scroll',
          }}
          width="20%"
        >
          <List>
            {categories.map((category, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setSearchString('');
                  setIsSearching(false);
                  if (choiceContainerRef.current) {
                    const element = choiceContainerRef.current.querySelector(
                      `#category-${index}`
                    );
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                sx={{ cursor: 'pointer', paddingY: 2 }}
              >
                <Typography>
                  <Msg
                    id={`misc.views.columnDialog.categories.${category.key}.title`}
                  />
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box ref={choiceContainerRef} flexGrow={1} sx={{ overflowY: 'scroll' }}>
          {isSearching ? (
            <Box padding={2}>
              <Typography variant="h4">
                <Msg
                  id="misc.views.columnDialog.gallery.searchResults"
                  values={{ searchString: searchString }}
                />
              </Typography>
              <Box>
                {searchResults.length > 0 ? (
                  <SearchResults
                    existingColumns={existingColumns}
                    onAdd={onAdd}
                    onConfigure={onConfigure}
                    searchResults={searchResults}
                  />
                ) : (
                  <Typography>
                    <Msg
                      id="misc.views.columnDialog.gallery.noSearchResults"
                      values={{ searchString: searchString }}
                    />
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <ChoiceCategories
              existingColumns={existingColumns}
              onAdd={onAdd}
              onConfigure={onConfigure}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ColumnGallery;
