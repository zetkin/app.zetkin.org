import {
  CheckBox,
  Description,
  EventNote,
  LocalOffer,
  Person,
  PersonAdd,
} from '@mui/icons-material';

import { ColumnChoice } from './types';
import DoubleIconCardVisual from '../DoubleIconCardVisual';
import getUniqueColumnName from '../../../utils/getUniqueColumnName';
import MultiIconCardVisual from '../MultiIconCardVisual';
import PersonTagConfig from '../PersonTagConfig';
import SingleIconCardVisual from '../SingleIconCardVisual';
import theme from 'theme';
import { COLUMN_TYPE, SelectedViewColumn, ZetkinViewColumn } from '../../types';

const { blue, purple, red } = theme.palette.viewColumnGallery;

export const personTag: ColumnChoice = {
  color: blue,
  renderCardVisual: (color: string) => (
    <SingleIconCardVisual color={color} icon={LocalOffer} />
  ),
  renderConfigForm: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => <PersonTagConfig onOutputConfigured={props.onOutputConfigured} />,
};

export const toggle: ColumnChoice = {
  allowInRestrictedMode: true,
  color: blue,
  defaultColumns: (messages, columns) => [
    {
      title: getUniqueColumnName(
        messages.columnDialog.choices.toggle.columnTitle(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_BOOL,
    },
  ],
  renderCardVisual: (color: string) => (
    <SingleIconCardVisual color={color} icon={CheckBox} />
  ),
};

export const followUpTemplate: ColumnChoice = {
  color: purple,
  defaultColumns: (messages, columns) => [
    {
      title: getUniqueColumnName(
        messages.columnDialog.choices.followUp.columnTitleCheckbox(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_BOOL,
    },
    {
      title: getUniqueColumnName(
        messages.columnDialog.choices.followUp.columnTitleNotes(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_TEXT,
    },
  ],
  renderCardVisual: (color: string) => (
    <DoubleIconCardVisual color={color} icons={[CheckBox, Description]} />
  ),
};

export const localPerson: ColumnChoice = {
  color: blue,
  defaultColumns: (messages, columns) => [
    {
      config: {
        field: COLUMN_TYPE.LOCAL_PERSON,
      },
      title: getUniqueColumnName(
        messages.columnDialog.choices.localPerson.columnTitle(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_PERSON,
    },
  ],
  renderCardVisual: (color: string) => {
    return <SingleIconCardVisual color={color} icon={PersonAdd} />;
  },
};

export const delegateTemplate: ColumnChoice = {
  color: red,
  defaultColumns: (messages, columns) => [
    {
      title: getUniqueColumnName(
        messages.columnDialog.choices.delegate.columnTitleAssignee(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_PERSON,
    },
    {
      title: getUniqueColumnName(
        messages.columnDialog.choices.delegate.columnTitleContacted(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_BOOL,
    },
    {
      title: getUniqueColumnName(
        messages.columnDialog.choices.delegate.columnTitleResponded(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_BOOL,
    },
    {
      title: getUniqueColumnName(
        messages.columnDialog.choices.delegate.columnTitleNotes(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_TEXT,
    },
  ],
  renderCardVisual: (color: string) => {
    return <MultiIconCardVisual color={color} icon={Person} />;
  },
};

export const localText: ColumnChoice = {
  allowInRestrictedMode: true,
  color: blue,
  defaultColumns: (messages, columns) => [
    {
      title: getUniqueColumnName(
        messages.columnDialog.choices.localText.columnTitle(),
        columns
      ),
      type: COLUMN_TYPE.LOCAL_TEXT,
    },
  ],
  renderCardVisual: (color: string) => {
    return <SingleIconCardVisual color={color} icon={EventNote} />;
  },
};
