import makeStyles from '@mui/styles/makeStyles';
import { Box, Divider, Theme, Typography } from '@mui/material';

import Field from './Field';
import FieldGroup from './FieldGroup';
import { allCollapsedPresentableFields, availableHeightByEvent } from './utils';

interface StyleProps {
  cancelled: boolean;
  collapsed: boolean;
  hasTopBadge: boolean;
  height: number;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  container: {
    alignItems: ({ collapsed }) => (collapsed ? 'center' : ''),
    border: `1px solid ${theme.palette.divider}`,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: ({ hasTopBadge }) => (hasTopBadge ? '0px' : '4px'),
    borderTopRightRadius: 4,
    display: 'inline-flex',
    flexDirection: ({ collapsed }) => (collapsed ? 'row' : 'column'),
    fontSize: 12,
    gap: '4px 0',
    height: ({ height }) => height,
    justifyContent: 'space-between',
    minWidth: '275px',
    padding: '0 4px',
    position: 'relative',
  },
  fieldGroups: {
    display: 'flex',
    flexFlow: 'column',
  },
  title: {
    fontSize: 14,
    paddingTop: ({ collapsed }) => (collapsed ? '0' : '4px'),
    textDecoration: ({ cancelled }) => (cancelled ? 'line-through' : ''),
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
  const collapsed = !fieldGroups.some((group) => {
    return group.some(
      (field) => field.presentation === FIELD_PRESENTATION.WITH_LABEL
    );
  });

  const availableHeightPerFieldGroup = availableHeightByEvent(
    height,
    fieldGroups.length
  );

  const classes = useStyles({
    cancelled,
    collapsed,
    hasTopBadge: !!topBadge,
    height,
  });

  return (
    <Box className={classes.container}>
      {topBadge}
      <Typography className={classes.title}>{title}</Typography>
      {collapsed && (
        <Box display="flex">
          {allCollapsedPresentableFields(fieldGroups).map((field, index) => {
            return (
              <Box key={`${field.kind}-${index}`} paddingLeft={1}>
                <Field field={field} />
              </Box>
            );
          })}
        </Box>
      )}
      {!collapsed && (
        <Box className={classes.fieldGroups}>
          {fieldGroups.map((fields, index) => (
            <>
              {index > 0 && <Divider />}
              <Box paddingTop={index > 0 ? 1 : ''}>
                <FieldGroup
                  key={`fieldGroup-${index}`}
                  fields={fields}
                  height={availableHeightPerFieldGroup[index]}
                />
              </Box>
            </>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Event;
