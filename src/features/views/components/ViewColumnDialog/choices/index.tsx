import { IntlShape } from 'react-intl';

import {
  PendingZetkinViewColumn,
  SelectedViewColumn,
  ZetkinViewColumn,
} from '../../types';

import * as fields from './fields';
import * as misc from './misc';
import * as query from './query';
import * as surveys from './surveys';

export enum CHOICES {
  DELEGATE = 'delegate',
  FIRST_AND_LAST_NAME = 'firstAndLastName',
  FOLLOW_UP = 'followUp',
  PERSON_FIELDS = 'personFields',
  SURVEY_SUBMIT_DATE = 'surveySubmitDate',
  TAG = 'tag',
  TOGGLE = 'toggle',
  ASSIGNEE = 'localPerson',
  NOTES = 'localText',
  CUSTOM_QUERY = 'localQuery',
  SURVEY_RESPONSE = 'surveyResponse',
  SURVEY_RESPONSES = 'surveyResponses',
}

export type ColumnChoice = {
  alreadyInView?: (columns: ZetkinViewColumn[]) => boolean;
  color: string;
  defaultColumns?: (
    intl: IntlShape,
    columns: ZetkinViewColumn[]
  ) => PendingZetkinViewColumn[];
  renderCardVisual: (color: string) => JSX.Element;
  renderConfigForm?: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => JSX.Element;
};

export type ColumnChoiceWithKey = ColumnChoice & { key: CHOICES };

const choices: Record<CHOICES, ColumnChoice> = {
  [CHOICES.FIRST_AND_LAST_NAME]: fields.fullName,
  [CHOICES.PERSON_FIELDS]: fields.pickFields,
  [CHOICES.CUSTOM_QUERY]: query.customQuery,
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
