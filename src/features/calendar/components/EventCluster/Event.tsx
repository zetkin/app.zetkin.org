import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';
import { Box, Theme, Typography } from '@mui/material';

import EventSelectionCheckBox from 'features/events/components/EventSelectionCheckBox';
import Field from './Field';
import FieldGroup from './FieldGroup';
import { useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import { allCollapsedPresentableFields, availableHeightByEvent } from './utils';

interface StyleProps {
  cancelled: boolean;
  draft: boolean;
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
    background: ({ cancelled, draft }) =>
      `linear-gradient(to right, ${
        cancelled || draft
          ? theme.palette.secondary.main
          : theme.palette.primary.main
      } 4px, white 4px)`,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: ({ hasTopBadge }) => (hasTopBadge ? '0px' : '4px'),
    borderTopRightRadius: 4,
    display: 'flex',
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
  draft: boolean;
  events: ZetkinEvent[];
  fieldGroups: PresentableField[][];
  height: number;
  title: string;
  topBadge?: JSX.Element | null | false;
  width: string;
}

const Event = ({
  cancelled,
  draft,
  events,
  fieldGroups,
  height,
  title,
  topBadge,
  width,
}: EventProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
    draft,
    hasTopBadge: !!topBadge,
    height,
    width,
  });

  const selectedEvents = useAppSelector(
    (state) => state.events.selectedEventIds
  );

  return (
    <Box
      className={classes.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {topBadge}
      {collapsed && (
        <Box className={classes.collapsedContainer}>
          <Box className={classes.title} display="flex">
            {(isHovered || selectedEvents.length > 0) && (
              <EventSelectionCheckBox events={events} />
            )}
            <Typography className={classes.title}>{title}</Typography>
          </Box>
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
            <Box alignItems="center" display="flex" sx={{ pl: 1 }}>
              {(isHovered || selectedEvents.length > 0) && (
                <EventSelectionCheckBox events={events} />
              )}
              <Typography className={classes.title}>{title}</Typography>
            </Box>
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
