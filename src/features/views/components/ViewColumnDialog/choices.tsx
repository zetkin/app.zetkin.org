import { IntlShape } from 'react-intl';
import {
  CheckBox,
  Description,
  EventNote,
  LocalOffer,
  Person,
} from '@mui/icons-material';

import DoubleIconCardVisual from './DoubleIconCardVisual';
import getUniqueColumnName from '../../utils/getUniqueColumnName';
import MultiIconCardVisual from './MultiIconCardVisual';
import PersonFieldConfig from './PersonFieldConfig';
import PersonTagConfig from './PersonTagConfig';
import SingleIconCardVisual from './SingleIconCardVisual';
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
  TAG = 'tag',
  BOOLEAN = 'toggle',
  LOCAL_PERSON = 'localPerson',
  LOCAL_TEXT = 'localText',
}

export type ColumnChoice = {
  alreadyInView?: (columns: ZetkinViewColumn[]) => boolean;
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
];

export default choices;
