import Fuse from 'fuse.js';
import { Box, List, ListItem, TextField, Typography } from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import { FunctionComponent, useMemo, useRef, useState } from 'react';
import { Theme, useMediaQuery } from '@mui/material';

import categories from '../categories';
import ChoiceCategories from './ChoiceCategories';
import { filterChoicesByMode } from './utils';
import SearchResults from './SearchResults';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import { ZetkinViewColumn } from 'features/views/components/types';
import choices, {
  CHOICES,
  ColumnChoice,
  ColumnChoiceWithKey,
} from '../choices';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';

interface ColumnGalleryProps {
  existingColumns: ZetkinViewColumn[];
  onAdd: (choice: ColumnChoice) => void;
  onClose: () => void;
  onConfigure: (choice: ColumnChoiceWithKey) => void;
}

const ColumnGallery: FunctionComponent<ColumnGalleryProps> = ({
  existingColumns,
  onAdd,
  onClose,
  onConfigure,
}) => {
  const messages = useMessages(messageIds);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  const [isRestrictedMode] = useAccessLevel();
  const [isSearching, setIsSearching] = useState(false);
  const [searchString, setSearchString] = useState('');

  //list of objects with localized strings to use in the fuse-search
  const searchObjects = Object.keys(choices).map((choiceKey) => {
    const typedChoiceKey = choiceKey as CHOICES;
    return {
      description: messages.columnDialog.choices[typedChoiceKey].description(),
      key: typedChoiceKey,
      keywords: messages.columnDialog.choices[typedChoiceKey].keywords(),
      title: messages.columnDialog.choices[typedChoiceKey].title(),
    };
  });

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
    return keys.map((key) => ({ ...choices[key], key }));
  };

  const searchResults = useMemo(() => search(), [searchString]);

  const choiceContainerRef = useRef<HTMLDivElement>();
  const filteredCategories = categories.filter(
    (category) =>
      !!filterChoicesByMode(isRestrictedMode, category.choices).length
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="space-between"
      width="100%"
    >
      <Box display="flex" justifyContent="space-between" padding={2}>
        <Typography variant="h4">
          <Msg id={messageIds.columnDialog.gallery.columns} />
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
            placeholder={messages.columnDialog.gallery.searchPlaceholder()}
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
      <Box
        display="flex"
        height="calc(100% - 90px)"
        justifyContent="space-between"
        width="100%"
      >
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
            {filteredCategories.map((category, index) => (
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
                    id={messageIds.columnDialog.categories[category.key].title}
                  />
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          ref={choiceContainerRef}
          display="flex"
          flexDirection="column"
          sx={{ overflowY: 'scroll' }}
          width={isMobile ? '100%' : '80%'}
        >
          {isSearching ? (
            <Box padding={2}>
              <Typography variant="h4">
                <Msg
                  id={messageIds.columnDialog.gallery.searchResults}
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
                  <Typography variant="h5">
                    <Msg
                      id={messageIds.columnDialog.gallery.noSearchResults}
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
