import { UseMessagesMap } from 'core/i18n';
import {
  PendingZetkinViewColumn,
  SelectedViewColumn,
  ZetkinViewColumn,
} from '../../types';
import messageIds from 'features/views/l10n/messageIds';

export enum CHOICES {
  DELEGATE = 'delegate',
  FULL_NAME = 'fullName',
  EMAIL = 'email',
  PHONE = 'phone',
  FOLLOW_UP = 'followUp',
  PERSON_FIELDS = 'personFields',
  SURVEY_SUBMIT_DATE = 'surveySubmitDate',
  TAG = 'tag',
  TOGGLE = 'toggle',
  ASSIGNEE = 'localPerson',
  NOTES = 'localText',
  CUSTOM_QUERY = 'localQuery',
  QUERY_REACHED = 'queryReached',
  QUERY_PARTICIPATED = 'queryParticipated',
  QUERY_BOOKED = 'queryBooked',
  SURVEY_RESPONSE = 'surveyResponse',
  SURVEY_RESPONSES = 'surveyResponses',
}

export type ColumnChoice = {
  allowInRestrictedMode?: boolean;
  alreadyInView?: (columns: ZetkinViewColumn[]) => boolean;
  color: string;
  defaultColumns?: (
    intl: UseMessagesMap<typeof messageIds>,
    columns: ZetkinViewColumn[]
  ) => PendingZetkinViewColumn[];
  renderCardVisual: (color: string) => JSX.Element;
  renderConfigForm?: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => JSX.Element;
};

export type ColumnChoiceWithKey = ColumnChoice & { key: CHOICES };
