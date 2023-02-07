import { CHOICES } from './choices';

const enum CATEGORIES {
  BASIC = 'basic',
  CATEGORIZING = 'categorizing',
  CROSS_REFERENCING = 'crossReferencing',
  SURVEYS = 'surveys',
  OUTREACH = 'outreach',
  UTILITY = 'utility',
}

const categories = [
  {
    choices: [CHOICES.FIRST_AND_LAST_NAME, CHOICES.PERSON_FIELDS],
    key: CATEGORIES.BASIC,
  },
  {
    choices: [CHOICES.TAG, CHOICES.BOOLEAN, CHOICES.LOCAL_QUERY],
    key: CATEGORIES.CATEGORIZING,
  },
  {
    choices: [CHOICES.LOCAL_QUERY],
    key: CATEGORIES.CROSS_REFERENCING,
  },
  {
    choices: [
      CHOICES.SURVEY_RESPONSE,
      CHOICES.SURVEY_RESPONSES,
      CHOICES.SURVEY_SUBMIT_DATE,
    ],
    key: CATEGORIES.SURVEYS,
  },
  {
    choices: [
      CHOICES.LOCAL_PERSON,
      CHOICES.BOOLEAN,
      CHOICES.LOCAL_TEXT,
      CHOICES.DELEGATE,
    ],
    key: CATEGORIES.OUTREACH,
  },
  {
    choices: [
      CHOICES.LOCAL_PERSON,
      CHOICES.BOOLEAN,
      CHOICES.LOCAL_TEXT,
      CHOICES.FOLLOW_UP,
    ],
    key: CATEGORIES.UTILITY,
  },
];

export default categories;
