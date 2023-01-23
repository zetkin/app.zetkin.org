import { CHOICES } from './choices';

const enum CATEGORIES {
  BASIC = 'basic',
}

const categories = [
  {
    choices: [
      CHOICES.FIRST_AND_LAST_NAME,
      CHOICES.PERSON_FIELDS,
      CHOICES.TAG,
      CHOICES.BOOLEAN,
      CHOICES.FOLLOW_UP,
      CHOICES.LOCAL_PERSON,
      CHOICES.DELEGATE,
    ],
    key: CATEGORIES.BASIC,
  },
];

export default categories;
