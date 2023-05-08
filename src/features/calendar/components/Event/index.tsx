import makeStyles from '@mui/styles/makeStyles';

import Field from './Field';
import { allCollapsedPresentableFields, availableHeightByEvent } from './utils';

const useStyles = makeStyles((theme) => ({
  container: {
    '&.cancelled': {
      '& .title': {
        textDecoration: 'line-through',
      },
      borderLeftColor: theme.palette.secondary.main,
    },
    '&.collapsed': {
      alignItems: 'center',
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    '&.single': {
      borderTopLeftRadius: 4,
    },
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    borderTopRightRadius: 4,
    boxShadow: '0 0 3px #ccc9c9',
    display: 'inline-flex',
    flexFlow: 'column',
    fontSize: 12,
    gap: '4px 0',
    minWidth: '275px',
    padding: '0 4px',
    position: 'relative',
  },
  fieldGroups: {
    display: 'flex',
    flexFlow: 'column',
  },
  fields: {
    display: 'flex',
    flexFlow: 'column',
    gap: '4px 0',
    position: 'relative',
  },
  fieldsWithIconOnly: {
    '&.collapsed': {
      position: 'static',
    },
    display: 'flex',
    gap: '0 4px',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  location: {
    color: theme.palette.secondary.main,
  },
  title: {
    '&.collapsed': {
      paddingTop: 0,
    },
    fontSize: 14,
    paddingTop: 4,
  },
}));

interface Participants {
  kind: 'Participants';
  requiresAction: boolean;
  message: string;
}

interface Location {
  kind: 'Location';
  requiresAction: false;
  message: string;
}

interface ScheduledTime {
  kind: 'ScheduledTime';
  requiresAction: false;
  message: string;
}

interface RemindersNotSent {
  kind: 'RemindersNotSent';
  requiresAction: true;
  message: string;
}

interface UnbookedSignups {
  kind: 'UnbookedSignups';
  requiresAction: true;
  message: string;
}

interface NoContactSelected {
  kind: 'NoContactSelected';
  requiresAction: true;
  message: string;
}

export enum FIELD_PRESENTATION {
  WITH_LABEL = 'WITH_LABEL',
  ICON_ONLY = 'ICON_ONLY',
}

export type Field =
  | Participants
  | Location
  | ScheduledTime
  | RemindersNotSent
  | UnbookedSignups
  | NoContactSelected;

export type PresentableField = Field & {
  presentation: FIELD_PRESENTATION;
};

interface EventProps {
  cancelled: boolean;
  fieldGroups: PresentableField[][];
  height: number;
  title: string;
  topBadge?: JSX.Element;
}

const Event = ({
  cancelled,
  fieldGroups,
  height,
  title,
  topBadge,
}: EventProps) => {
  const classes = useStyles();
  const allFieldsAreCollapsed = !fieldGroups.some((group) => {
    return group.some(
      (field) => field.presentation === FIELD_PRESENTATION.WITH_LABEL
    );
  });
  const availableHeightPerFieldGroup = availableHeightByEvent(
    height,
    fieldGroups.length
  );

  if (allFieldsAreCollapsed) {
    const collapsedFields: PresentableField[] =
      allCollapsedPresentableFields(fieldGroups);

    return (
      <div
        className={classes.container + ' collapsed'}
        style={{
          borderTopLeftRadius: topBadge ? '0px' : '4px',
          height: height,
          justifyContent: 'space-between',
        }}
      >
        {topBadge}
        <span
          className={
            classes.title + (allFieldsAreCollapsed ? ' collapsed' : '')
          }
        >
          {title}
        </span>
        <div
          style={{
            display: 'flex',
            gap: '0 4px',
          }}
        >
          {collapsedFields.map((field, index) => {
            return <Field key={`${field.kind}-${index}`} field={field} />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        classes.container +
        (cancelled ? ' cancelled' : '') +
        (fieldGroups.length == 1 ? ' single' : '')
      }
      style={{
        borderTopLeftRadius: topBadge ? '0px' : '4px',
        height: height,
      }}
    >
      {topBadge}
      <span className={classes.title}>{title}</span>
      <div className={classes.fieldGroups}>
        {fieldGroups.map((fields, index) => (
          <FieldGroup
            key={`fieldGroup-${index}`}
            fields={fields}
            height={availableHeightPerFieldGroup[index]}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const FieldGroup = ({
  fields,
  height,
  index,
}: {
  fields: PresentableField[];
  height: number;
  index: number;
}) => {
  const classes = useStyles();
  const fieldsWithLabel = fields.filter(
    (f) => f.presentation === FIELD_PRESENTATION.WITH_LABEL
  );
  const fieldsWithIconOnly = fields.filter(
    (f) => f.presentation === FIELD_PRESENTATION.ICON_ONLY
  );
  const isFirstFieldGroup = index === 0;

  return (
    <div
      className={classes.fields}
      style={{
        borderTop: isFirstFieldGroup ? '' : 'solid 1px gray',
        height,
        paddingTop: isFirstFieldGroup ? '' : '4px',
      }}
    >
      <div className={classes.fieldsWithIconOnly}>
        {fieldsWithIconOnly.map((field, index) => (
          <Field key={`${field.kind}-${index}`} field={field} />
        ))}
      </div>
      {fieldsWithLabel.map((field, index) => (
        <Field key={`${field.kind}-${index}`} field={field} />
      ))}
    </div>
  );
};

export default Event;
