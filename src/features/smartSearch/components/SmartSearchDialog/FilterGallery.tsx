import { ChevronLeft } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { FILTER_TYPE } from 'features/smartSearch/components/types';
import { Msg } from 'core/i18n';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { useRef } from 'react';

interface FilterGalleryProps {
  onCancelAddNewFilter: () => void;
  onAddNewFilter: (type: FILTER_TYPE) => void;
}

enum FILTER_CATEGORY {
  BASIC = 'basicInformation',
  CROSS_REFERENCING = 'crossReferencing',
  EVENTS = 'events',
  MISC = 'misc',
  PHONE_BANKING = 'phoneBanking',
  SURVEYS = 'surveys',
  TASKS = 'tasks',
}

const GROUPED_FILTERS: { [key in FILTER_CATEGORY]: FILTER_TYPE[] } = {
  [FILTER_CATEGORY.BASIC]: [
    FILTER_TYPE.PERSON_DATA,
    FILTER_TYPE.PERSON_FIELD,
    FILTER_TYPE.PERSON_TAGS,
  ],
  [FILTER_CATEGORY.EVENTS]: [FILTER_TYPE.CAMPAIGN_PARTICIPATION],
  [FILTER_CATEGORY.TASKS]: [FILTER_TYPE.TASK],
  [FILTER_CATEGORY.PHONE_BANKING]: [FILTER_TYPE.CALL_HISTORY],
  [FILTER_CATEGORY.SURVEYS]: [
    FILTER_TYPE.SURVEY_SUBMISSION,
    FILTER_TYPE.SURVEY_RESPONSE,
    FILTER_TYPE.SURVEY_OPTION,
  ],
  [FILTER_CATEGORY.CROSS_REFERENCING]: [
    FILTER_TYPE.SUB_QUERY,
    FILTER_TYPE.PERSON_VIEW,
  ],
  [FILTER_CATEGORY.MISC]: [FILTER_TYPE.RANDOM, FILTER_TYPE.USER],
};

const FilterGallery = ({
  onCancelAddNewFilter,
  onAddNewFilter,
}: FilterGalleryProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const choiceContainerRef = useRef<HTMLDivElement>();

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" pb={2}>
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        mb={1}
      >
        <Box flex={1}>
          <Button
            color="primary"
            onClick={onCancelAddNewFilter}
            startIcon={<ChevronLeft />}
          >
            <Msg id={messageIds.buttonLabels.goBack} />
          </Button>
        </Box>
        <Box flex={1}>
          <Typography align="center" variant="h5">
            <Msg id={messageIds.headers.gallery} />
          </Typography>
        </Box>
        <Box flex={1} />
      </Box>
      <Box
        display="flex"
        height="100%"
        justifyContent="space-between"
        paddingBottom={2}
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
          {Object.entries(GROUPED_FILTERS).map(([category, filters], index) => (
            <Box key={`category-${index}`} id={`category-${index}`} padding={2}>
              <Box>
                <Typography variant="h4">
                  <Msg
                    id={
                      messageIds.filterCategories[category as FILTER_CATEGORY]
                        .title
                    }
                  />
                </Typography>
                <Typography variant="h5">
                  <Msg
                    id={
                      messageIds.filterCategories[category as FILTER_CATEGORY]
                        .description
                    }
                  />
                </Typography>
              </Box>
              <Grid container paddingTop={2} spacing={3}>
                {filters.map((filter) => (
                  <Grid
                    key={filter}
                    item
                    lg={4}
                    onClick={() => onAddNewFilter(filter)}
                    sm={6}
                    xs={12}
                  >
                    <Card
                      style={{
                        height: '200px',
                        width: '300px',
                      }}
                    >
                      <Box
                        alignItems="center"
                        display="flex"
                        height={1}
                        justifyContent="center"
                        padding={1}
                      >
                        <Typography>
                          <Msg id={messageIds.filterTitles[filter]} />
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FilterGallery;
