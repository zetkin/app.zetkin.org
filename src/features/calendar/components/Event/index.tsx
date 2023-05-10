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
  width: number;
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
    minHeihgt: '20px',
    position: 'relative',
    width: ({ width }) => width,
  },
  fieldGroups: {
    display: 'flex',
    flexFlow: 'column',
  },
  title: {
    fontSize: '14px',
    minHeight: '20px',
    overflow: 'hidden',
    textDecoration: ({ cancelled }) => (cancelled ? 'line-through' : ''),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
  topBadge?: JSX.Element;
  width: number;
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
        <Box alignItems="center" display="flex" paddingX={1} width="100%">
          <Typography className={classes.title}>{title}</Typography>
          <Box alignItems="center" display="flex">
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
        <>
          <Typography className={classes.title} paddingX={1}>
            {title}
          </Typography>
          <Box className={classes.fieldGroups}>
            {fieldGroups.map((fields, index) => (
              <>
                {index > 0 && <Divider />}
                <Box paddingTop={index > 0 ? 1 : ''} paddingX={1}>
                  <FieldGroup
                    key={`fieldGroup-${index}`}
                    fields={fields}
                    height={availableHeightPerFieldGroup[index]}
                  />
                </Box>
              </>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Event;
