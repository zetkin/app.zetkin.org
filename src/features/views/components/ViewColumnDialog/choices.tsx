import { IntlShape } from 'react-intl';
import {
  CheckBox,
  ContactSupport,
  Description,
  Event,
  EventNote,
  LocalOffer,
  Person,
  PersonSearch,
} from '@mui/icons-material';

import DoubleIconCardVisual from './DoubleIconCardVisual';
import getUniqueColumnName from '../../utils/getUniqueColumnName';
import LocalSmartSearchConfig from './LocalSmartSearchConfig';
import MultiIconCardVisual from './MultiIconCardVisual';
import PersonFieldConfig from './PersonFieldConfig';
import PersonTagConfig from './PersonTagConfig';
import SingleIconCardVisual from './SingleIconCardVisual';
import SurveyResponseConfig from './SurveyResponseConfig';
import SurveyResponsesConfig from './SurveyResponsePluralConfig';
import SurveySubmitDateConfig from './SurveySubmitDateConfig';

import theme from 'theme';
import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
  PendingZetkinViewColumn,
  SelectedViewColumn,
  ZetkinViewColumn,
} from '../types';

export enum CHOICES {
  DELEGATE = 'delegate',
  FIRST_AND_LAST_NAME = 'firstAndLastName',
  FOLLOW_UP = 'followUp',
  PERSON_FIELDS = 'personFields',
  SURVEY_SUBMIT_DATE = 'surveySubmitDate',
  TAG = 'tag',
  BOOLEAN = 'toggle',
  LOCAL_PERSON = 'localPerson',
  LOCAL_SMART_SEARCH = 'localSmartSearch',
  LOCAL_TEXT = 'localText',
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
  key: string;
  renderCardVisual: (color: string) => JSX.Element;
  renderConfigForm?: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => JSX.Element;
};

const { blue, purple, red } = theme.palette.viewColumnGallery;

const choices: ColumnChoice[] = [
  {
    alreadyInView: (columns) => {
      const fieldsToAdd = [
        NATIVE_PERSON_FIELDS.FIRST_NAME,
        NATIVE_PERSON_FIELDS.LAST_NAME,
      ];
      return fieldsToAdd.every((fieldName) =>
        columns.some(
          (col) =>
            col.type == COLUMN_TYPE.PERSON_FIELD &&
            col.config.field == fieldName
        )
      );
    },
    color: purple,
    defaultColumns: (intl) => [
      {
        config: {
          field: NATIVE_PERSON_FIELDS.FIRST_NAME,
        },
        title: intl.formatMessage({
          id: 'misc.views.columnDialog.commonHeaders.firstName',
        }),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
      {
        config: {
          field: NATIVE_PERSON_FIELDS.LAST_NAME,
        },
        title: intl.formatMessage({
          id: 'misc.views.columnDialog.commonHeaders.lastName',
        }),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
    ],
    key: CHOICES.FIRST_AND_LAST_NAME,
    renderCardVisual: (color: string) => {
      return <DoubleIconCardVisual color={color} icons={[Person, Person]} />;
    },
  },
  {
    color: blue,
    key: CHOICES.TAG,
    renderCardVisual: (color: string) => (
      <SingleIconCardVisual color={color} icon={LocalOffer} />
    ),
    renderConfigForm: (props: {
      existingColumns: ZetkinViewColumn[];
      onOutputConfigured: (columns: SelectedViewColumn[]) => void;
    }) => <PersonTagConfig onOutputConfigured={props.onOutputConfigured} />,
  },
  {
    alreadyInView: (columns) => {
      return Object.values(NATIVE_PERSON_FIELDS).every((fieldName) =>
        columns.some(
          (col) =>
            col.type == COLUMN_TYPE.PERSON_FIELD &&
            col.config.field == fieldName
        )
      );
    },
    color: blue,
    key: CHOICES.PERSON_FIELDS,
    renderCardVisual: (color: string) => (
      <SingleIconCardVisual color={color} icon={Person} />
    ),
    renderConfigForm: (props: {
      existingColumns: ZetkinViewColumn[];
      onOutputConfigured: (columns: SelectedViewColumn[]) => void;
    }) => (
      <PersonFieldConfig
        existingColumns={props.existingColumns}
        onOutputConfigured={props.onOutputConfigured}
      />
    ),
  },
  {
    color: blue,
    defaultColumns: (intl, columns) => [
      {
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.toggle.columnTitle',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_BOOL,
      },
    ],
    key: CHOICES.BOOLEAN,
    renderCardVisual: (color: string) => (
      <SingleIconCardVisual color={color} icon={CheckBox} />
    ),
  },
  {
    color: purple,
    defaultColumns: (intl, columns) => [
      {
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.followUp.columnTitleCheckbox',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_BOOL,
      },
      {
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.followUp.columnTitleNotes',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_TEXT,
      },
    ],
    key: CHOICES.FOLLOW_UP,
    renderCardVisual: (color: string) => (
      <DoubleIconCardVisual color={color} icons={[CheckBox, Description]} />
    ),
  },
  {
    color: blue,
    defaultColumns: (intl, columns) => [
      {
        config: {
          field: COLUMN_TYPE.LOCAL_PERSON,
        },
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.localPerson.columnTitle',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_PERSON,
      },
    ],
    key: CHOICES.LOCAL_PERSON,
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={Person} />;
    },
  },
  {
    alreadyInView: () => {
      //This card never disables.
      return false;
    },
    color: blue,
    key: CHOICES.SURVEY_SUBMIT_DATE,
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={Event} />;
    },
    renderConfigForm: (props: {
      existingColumns: ZetkinViewColumn[];
      onOutputConfigured: (columns: SelectedViewColumn[]) => void;
    }) => (
      <SurveySubmitDateConfig onOutputConfigured={props.onOutputConfigured} />
    ),
  },
  {
    color: red,
    defaultColumns: (intl, columns) => [
      {
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.delegate.columnTitleAssignee',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_PERSON,
      },
      {
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.delegate.columnTitleContacted',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_BOOL,
      },
      {
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.delegate.columnTitleResponded',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_BOOL,
      },
      {
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.delegate.columnTitleNotes',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_TEXT,
      },
    ],
    key: CHOICES.DELEGATE,
    renderCardVisual: (color: string) => {
      return <MultiIconCardVisual color={color} icon={Person} />;
    },
  },
  {
    color: blue,
    defaultColumns: (intl, columns) => [
      {
        config: {
          field: COLUMN_TYPE.LOCAL_TEXT,
        },
        title: getUniqueColumnName(
          intl.formatMessage({
            id: 'misc.views.columnDialog.choices.localText.columnTitle',
          }),
          columns
        ),
        type: COLUMN_TYPE.LOCAL_TEXT,
      },
    ],
    key: CHOICES.LOCAL_TEXT,
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={EventNote} />;
    },
  },
  {
    color: blue,
    key: CHOICES.LOCAL_SMART_SEARCH,
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={PersonSearch} />;
    },
    renderConfigForm: (props: {
      existingColumns: ZetkinViewColumn[];
      onOutputConfigured: (columns: SelectedViewColumn[]) => void;
    }) => (
      <LocalSmartSearchConfig onOutputConfigured={props.onOutputConfigured} />
    ),
  },
  {
    color: blue,
    key: CHOICES.SURVEY_RESPONSES,
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={ContactSupport} />;
    },
    renderConfigForm: (props: {
      existingColumns: ZetkinViewColumn[];
      onOutputConfigured: (columns: SelectedViewColumn[]) => void;
    }) => (
      <SurveyResponsesConfig onOutputConfigured={props.onOutputConfigured} />
    ),
  },
  {
    color: blue,
    key: CHOICES.SURVEY_RESPONSE,
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={ContactSupport} />;
    },
    renderConfigForm: (props: {
      existingColumns: ZetkinViewColumn[];
      onOutputConfigured: (columns: SelectedViewColumn[]) => void;
    }) => (
      <SurveyResponseConfig onOutputConfigured={props.onOutputConfigured} />
    ),
  },
];

export default choices;
