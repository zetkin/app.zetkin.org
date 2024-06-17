import theme from 'theme';
import { FILTER_CATEGORY, FILTER_TYPE } from '../../types';

const filterCategoryColors = theme.palette.filterCategoryColors;

export const GROUPED_FILTERS: {
  [key in FILTER_CATEGORY]: {
    colors: { pale: string; strong: string };
    filters: Exclude<FILTER_TYPE, 'all' | 'call_blocked' | 'most_active'>[];
  };
} = {
  [FILTER_CATEGORY.BASIC]: {
    colors: {
      pale: filterCategoryColors.lightBlue.pale,
      strong: filterCategoryColors.lightBlue.strong,
    },
    filters: [
      FILTER_TYPE.PERSON_DATA,
      FILTER_TYPE.PERSON_FIELD,
      FILTER_TYPE.PERSON_TAGS,
    ],
  },
  [FILTER_CATEGORY.EMAIL]: {
    colors: {
      pale: filterCategoryColors.teal.pale,
      strong: filterCategoryColors.teal.strong,
    },
    filters: [
      FILTER_TYPE.EMAIL_HISTORY,
      FILTER_TYPE.EMAIL_CLICK,
      FILTER_TYPE.EMAIL_BLACKLIST,
    ],
  },
  [FILTER_CATEGORY.EVENTS]: {
    colors: {
      pale: filterCategoryColors.green.pale,
      strong: filterCategoryColors.green.strong,
    },
    filters: [FILTER_TYPE.CAMPAIGN_PARTICIPATION],
  },
  [FILTER_CATEGORY.JOURNEY]: {
    colors: {
      pale: filterCategoryColors.pink.pale,
      strong: filterCategoryColors.pink.strong,
    },
    filters: [FILTER_TYPE.JOURNEY],
  },
  [FILTER_CATEGORY.TASKS]: {
    colors: {
      pale: filterCategoryColors.yellow.pale,
      strong: filterCategoryColors.yellow.strong,
    },
    filters: [FILTER_TYPE.TASK],
  },
  [FILTER_CATEGORY.PHONE_BANKING]: {
    colors: {
      pale: filterCategoryColors.orange.pale,
      strong: filterCategoryColors.orange.strong,
    },
    filters: [FILTER_TYPE.CALL_HISTORY],
  },
  [FILTER_CATEGORY.SURVEYS]: {
    colors: {
      pale: filterCategoryColors.darkBlue.pale,
      strong: filterCategoryColors.darkBlue.strong,
    },
    filters: [
      FILTER_TYPE.SURVEY_SUBMISSION,
      FILTER_TYPE.SURVEY_RESPONSE,
      FILTER_TYPE.SURVEY_OPTION,
    ],
  },
  [FILTER_CATEGORY.CROSS_REFERENCING]: {
    colors: {
      pale: filterCategoryColors.purple.pale,
      strong: filterCategoryColors.purple.strong,
    },
    filters: [FILTER_TYPE.SUB_QUERY, FILTER_TYPE.PERSON_VIEW],
  },
  [FILTER_CATEGORY.MISC]: {
    colors: {
      pale: filterCategoryColors.red.pale,
      strong: filterCategoryColors.red.strong,
    },
    filters: [FILTER_TYPE.RANDOM, FILTER_TYPE.USER],
  },
};
