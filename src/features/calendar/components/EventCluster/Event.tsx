import makeStyles from '@mui/styles/makeStyles';
import { Box, Theme, Typography } from '@mui/material';

import Field from './Field';
import FieldGroup from './FieldGroup';
import { allCollapsedPresentableFields, availableHeightByEvent } from './utils';

interface StyleProps {
  cancelled: boolean;
  collapsed: boolean;
  hasTopBadge: boolean;
  height: number;
  width: string;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  collapsedContainer: {
    alignItems: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: ({ hasTopBadge }) => (hasTopBadge ? '0px' : '4px'),
    borderTopRightRadius: 4,
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
    padding: '0 4px 0 8px',
    width: '100%',
  },
  container: {
    alignItems: ({ collapsed }) => (collapsed ? 'center' : ''),
    background: ({ cancelled }) =>
      `linear-gradient(to right, ${
        cancelled ? theme.palette.secondary.main : theme.palette.primary.main
      } 4px, white 4px)`,
    border: `1px solid ${theme.palette.grey[300]}`,
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
    minHeihgt: '20px',
    position: 'relative',
    width: ({ width }) => width,
  },
  fieldGroupContainer: {
    borderTop: `1px solid ${theme.palette.grey[300]}`,
  },
  fieldGroups: {
    display: 'flex',
    flexFlow: 'column',
    overflowY: 'hidden',
  },
  title: {
    fontSize: '14px',
    minHeight: '20px',
    overflow: 'hidden',
    textDecoration: ({ cancelled }) => (cancelled ? 'line-through' : ''),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleContainer: {
    borderTopLeftRadius: ({ hasTopBadge }) => (hasTopBadge ? '0px' : '4px'),
    borderTopRightRadius: 4,
  },
}));

interface Participants {
  kind: 'Participants';
  requiresAction: boolean;
  message: string | JSX.Element;
}

interface Location {
  kind: 'Location';
  requiresAction: false;
  message: string | JSX.Element;
}

interface ScheduledTime {
  kind: 'ScheduledTime';
  requiresAction: false;
  message: JSX.Element;
}

interface RemindersNotSent {
  kind: 'RemindersNotSent';
  requiresAction: true;
  message: JSX.Element;
}

interface UnbookedSignups {
  kind: 'UnbookedSignups';
  requiresAction: true;
  message: JSX.Element;
}

interface NoContactSelected {
  kind: 'NoContactSelected';
  requiresAction: true;
  message: JSX.Element;
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
  topBadge?: JSX.Element | null | false;
  width: string;
}

const Event = ({
  cancelled,
  fieldGroups,
  height,
  title,
  topBadge,
  width,
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
    width,
  });

  return (
    <Box className={classes.container}>
      {topBadge}
      {collapsed && (
        <Box className={classes.collapsedContainer}>
          <Typography className={classes.title}>{title}</Typography>
          <Box display="flex">
            {allCollapsedPresentableFields(fieldGroups).map((field, index) => {
              return (
                <Box
                  key={`${field.kind}-${index}`}
                  paddingLeft={index > 0 ? '2px' : ''}
                >
                  <Field field={field} />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
      {!collapsed && (
        <Box height="100%">
          <Box className={classes.titleContainer}>
            <Typography className={classes.title} paddingX={1}>
              {title}
            </Typography>
          </Box>
          <Box className={classes.fieldGroups}>
            {fieldGroups.map((fields, index) => (
              <Box
                key={`fieldGroup-${index}`}
                className={index > 0 ? classes.fieldGroupContainer : ''}
              >
                <FieldGroup
                  fields={fields}
                  height={availableHeightPerFieldGroup[index]}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Event;
