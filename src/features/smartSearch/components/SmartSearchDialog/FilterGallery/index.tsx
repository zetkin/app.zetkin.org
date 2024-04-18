import { ChevronLeft } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import FilterGalleryCard from './FilterGalleryCard';
import { GROUPED_FILTERS } from './groupedFilters';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import { useRef } from 'react';
import {
  FILTER_CATEGORY,
  FILTER_TYPE,
} from 'features/smartSearch/components/types';

interface FilterGalleryProps {
  onCancelAddNewFilter: () => void;
  onAddNewFilter: (type: FILTER_TYPE) => void;
}

const FilterGallery = ({
  onCancelAddNewFilter,
  onAddNewFilter,
}: FilterGalleryProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const choiceContainerRef = useRef<HTMLDivElement>();

  return (
    <>
      <Box
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
      >
        <Button
          color="primary"
          onClick={onCancelAddNewFilter}
          startIcon={<ChevronLeft />}
        >
          <Msg id={messageIds.buttonLabels.goBack} />
        </Button>
        <Typography variant="h4">
          <Msg id={messageIds.headers.gallery} />
        </Typography>
      </Box>
      <Box display="flex" height="100%" overflow="hidden">
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
            {Object.entries(GROUPED_FILTERS).map(([category], index) => (
              <ListItem
                key={index}
                onClick={() => {
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
                    id={
                      messageIds.filterCategories[category as FILTER_CATEGORY]
                        .title
                    }
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
          sx={{ overflowY: 'auto' }}
          width={isMobile ? '100%' : '80%'}
        >
          {Object.entries(GROUPED_FILTERS).map(
            ([slug, categoryData], index) => (
              <Box
                key={`category-${index}`}
                id={`category-${index}`}
                padding={2}
              >
                <Typography variant="h4">
                  <Msg
                    id={
                      messageIds.filterCategories[slug as FILTER_CATEGORY].title
                    }
                  />
                </Typography>
                <Typography variant="h5">
                  <Msg
                    id={
                      messageIds.filterCategories[slug as FILTER_CATEGORY]
                        .description
                    }
                  />
                </Typography>

                <Grid container paddingTop={2} spacing={3}>
                  {categoryData.filters.map((filter) => (
                    <Grid key={filter} item lg={4} sm={6} xs={12}>
                      <FilterGalleryCard
                        colors={categoryData.colors}
                        filter={filter}
                        onAddFilter={() => onAddNewFilter(filter)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )
          )}
        </Box>
      </Box>
    </>
  );
};

export default FilterGallery;
