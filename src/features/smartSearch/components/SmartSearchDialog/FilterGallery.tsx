import { ChevronLeft } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonBase,
  Card,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { FILTER_TYPE } from 'features/smartSearch/components/types';
import { Msg } from 'core/i18n';

import messageIds from 'features/smartSearch/l10n/messageIds';

interface FilterGalleryProps {
  onCancelAddNewFilter: () => void;
  onAddNewFilter: (type: FILTER_TYPE) => void;
}

enum FILTER_CATEGORY {
  EMAIL = 'email',
  PEOPLE = 'peopleDatabase',
  PHONE_BANKING = 'phoneBanking',
  CAMPAIGN_ACTIVITY = 'campaignActivity',
  SURVEYS = 'surveys',
  MISC = 'misc',
}

const GROUPED_FILTERS: { [key in FILTER_CATEGORY]: FILTER_TYPE[] } = {
  [FILTER_CATEGORY.PEOPLE]: [
    FILTER_TYPE.PERSON_DATA,
    FILTER_TYPE.PERSON_FIELD,
    FILTER_TYPE.PERSON_TAGS,
    FILTER_TYPE.PERSON_VIEW,
  ],
  [FILTER_CATEGORY.CAMPAIGN_ACTIVITY]: [
    FILTER_TYPE.CAMPAIGN_PARTICIPATION,
    FILTER_TYPE.TASK,
  ],
  [FILTER_CATEGORY.PHONE_BANKING]: [FILTER_TYPE.CALL_HISTORY],
  [FILTER_CATEGORY.SURVEYS]: [
    FILTER_TYPE.SURVEY_SUBMISSION,
    FILTER_TYPE.SURVEY_RESPONSE,
    FILTER_TYPE.SURVEY_OPTION,
  ],
  [FILTER_CATEGORY.EMAIL]: [
    FILTER_TYPE.EMAIL_BLACKLIST,
    FILTER_TYPE.EMAIL_HISTORY,
    FILTER_TYPE.EMAIL_CLICK,
  ],
  [FILTER_CATEGORY.MISC]: [
    FILTER_TYPE.RANDOM,
    FILTER_TYPE.USER,
    FILTER_TYPE.SUB_QUERY,
  ],
};

const FilterGallery = ({
  onCancelAddNewFilter,
  onAddNewFilter,
}: FilterGalleryProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box display="flex" flexDirection="column" pb={2}>
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
      {Object.entries(GROUPED_FILTERS).map(([category, filters]) => (
        <Box key={category} margin="auto" width={0.9}>
          <Box pl={2}>
            <Typography variant="h6">
              <Msg
                id={messageIds.filterCategories[category as FILTER_CATEGORY]}
              />
            </Typography>
          </Box>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent={isMobile ? 'center' : 'start'}
          >
            {filters.map((filter) => (
              <ButtonBase
                key={filter}
                disableRipple
                onClick={() => onAddNewFilter(filter)}
              >
                <Card
                  style={{
                    height: '200px',
                    margin: '1rem',
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
              </ButtonBase>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default FilterGallery;
