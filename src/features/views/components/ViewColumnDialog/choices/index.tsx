import { CHOICES, ColumnChoice, ColumnChoiceWithKey } from './types';
import * as fields from './fields';
import * as misc from './misc';
import * as query from './query';
import * as surveys from './surveys';

const choices: Record<CHOICES, ColumnChoice> = {
  [CHOICES.FULL_NAME]: fields.fullName,
  [CHOICES.EMAIL]: fields.email,
  [CHOICES.PHONE]: fields.phone,
  [CHOICES.PERSON_FIELDS]: fields.pickFields,
  [CHOICES.CUSTOM_QUERY]: query.customQuery,
  [CHOICES.QUERY_BOOKED]: query.booked,
  [CHOICES.QUERY_REACHED]: query.reached,
  [CHOICES.QUERY_PARTICIPATED]: query.participated,
  [CHOICES.SURVEY_RESPONSE]: surveys.singleSurveyQuestion,
  [CHOICES.SURVEY_RESPONSES]: surveys.multipleSurveyQuestions,
  [CHOICES.SURVEY_SUBMIT_DATE]: surveys.surveySubmitDate,
  [CHOICES.DELEGATE]: misc.delegateTemplate,
  [CHOICES.FOLLOW_UP]: misc.followUpTemplate,
  [CHOICES.TAG]: misc.personTag,
  [CHOICES.TOGGLE]: misc.toggle,
  [CHOICES.ASSIGNEE]: misc.localPerson,
  [CHOICES.NOTES]: misc.localText,
};

export default choices;

export type { CHOICES, ColumnChoice, ColumnChoiceWithKey };
