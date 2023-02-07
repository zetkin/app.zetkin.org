import { CHOICES } from './choices/types';

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
    choices: [
      CHOICES.FULL_NAME,
      CHOICES.EMAIL,
      CHOICES.PHONE,
      CHOICES.PERSON_FIELDS,
    ],
    key: CATEGORIES.BASIC,
  },
  {
    choices: [CHOICES.TAG, CHOICES.TOGGLE, CHOICES.CUSTOM_QUERY],
    key: CATEGORIES.CATEGORIZING,
  },
  {
    choices: [
      CHOICES.QUERY_REACHED,
      CHOICES.QUERY_BOOKED,
      CHOICES.QUERY_PARTICIPATED,
      CHOICES.CUSTOM_QUERY,
    ],
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
      CHOICES.PERSON_FIELDS,
      CHOICES.ASSIGNEE,
      CHOICES.TOGGLE,
      CHOICES.NOTES,
      CHOICES.DELEGATE,
    ],
    key: CATEGORIES.OUTREACH,
  },
  {
    choices: [
      CHOICES.ASSIGNEE,
      CHOICES.TOGGLE,
      CHOICES.NOTES,
      CHOICES.FOLLOW_UP,
    ],
    key: CATEGORIES.UTILITY,
  },
];

export default categories;
