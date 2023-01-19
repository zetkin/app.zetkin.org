import Fuse from 'fuse.js';
import {
  Box,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import { FunctionComponent, useRef, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import categories from './categories';
import ColumnChoiceCard from './ColumnChoiceCard';
import { Theme, useMediaQuery } from '@mui/material';

import { ZetkinViewColumn } from 'features/views/components/types';
import choices, { ColumnChoice } from './choices';

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
  const [searchResults, setSearchResults] = useState<
    (ColumnChoice | undefined)[]
  >([]);

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

    //get the choice objects with matching keys
    const results = keys.map((key) =>
      choices.find((choice) => choice.key === key)
    );

    setSearchResults(results);
  };

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
              search();
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
                  <Grid container paddingTop={2} spacing={3}>
                    {searchResults.map((searchResult) => {
                      if (!searchResult) {
                        return;
                      }
                      const alreadyInView =
                        searchResult.alreadyInView &&
                        searchResult.alreadyInView(existingColumns);
                      return (
                        <Grid key={searchResult.key} item lg={4} sm={6} xs={12}>
                          <ColumnChoiceCard
                            alreadyInView={alreadyInView}
                            cardVisual={searchResult.renderCardVisual(
                              alreadyInView ? 'gray' : '#234890'
                            )}
                            color={alreadyInView ? 'gray' : '#234890'}
                            description={intl.formatMessage({
                              id: `misc.views.columnDialog.choices.${searchResult.key}.description`,
                            })}
                            onAdd={() => onAdd(searchResult)}
                            onConfigure={() => onConfigure(searchResult)}
                            showAddButton={!!searchResult.defaultColumns}
                            showConfigureButton={
                              !!searchResult.renderConfigForm
                            }
                            title={intl.formatMessage({
                              id: `misc.views.columnDialog.choices.${searchResult.key}.title`,
                            })}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
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
            categories.map((category, index) => (
              <Box
                key={`category-${index}`}
                id={`category-${index}`}
                padding={2}
              >
                <Typography variant="h4">
                  <Msg
                    id={`misc.views.columnDialog.categories.${category.key}.title`}
                  />
                </Typography>
                <Typography variant="h5">
                  <Msg
                    id={`misc.views.columnDialog.categories.${category.key}.description`}
                  />
                </Typography>
                <Grid container paddingTop={2} spacing={3}>
                  {category.choices.map((choiceName) => {
                    const choice = choices.find(
                      (choice) => choice.key === choiceName
                    );
                    if (!choice) {
                      return;
                    }
                    const alreadyInView =
                      choice.alreadyInView &&
                      choice.alreadyInView(existingColumns);
                    return (
                      <Grid key={choice.key} item lg={4} sm={6} xs={12}>
                        <ColumnChoiceCard
                          alreadyInView={alreadyInView}
                          cardVisual={choice.renderCardVisual(
                            alreadyInView ? 'gray' : '#234890'
                          )}
                          color={alreadyInView ? 'gray' : '#234890'}
                          description={intl.formatMessage({
                            id: `misc.views.columnDialog.choices.${choice.key}.description`,
                          })}
                          onAdd={() => onAdd(choice)}
                          onConfigure={() => onConfigure(choice)}
                          showAddButton={!!choice.defaultColumns}
                          showConfigureButton={!!choice.renderConfigForm}
                          title={intl.formatMessage({
                            id: `misc.views.columnDialog.choices.${choice.key}.title`,
                          })}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ColumnGallery;
