import { EmojiPeople, FaceRetouchingOff, Group, MailOutline, PlaceOutlined, ScheduleOutlined } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import ZUIIconLabel, { ZUIIconLabelProps } from 'zui/ZUIIconLabel';
import { Box, Button, Link, Tooltip, Typography } from '@mui/material';
import { ZetkinEvent } from 'utils/types/zetkin';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    display: 'inline-flex',
    flexFlow: 'column',
    padding: '0 4px',
    gap: '4px 0',
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    boxShadow: '0 0 3px #ccc9c9',
    minWidth: '275px',
    '&.cancelled': {
      borderLeftColor: theme.palette.secondary.main,

      '& .title': {
        textDecoration: 'line-through'
      }
    },
    '&.collapsed': {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    '&.single': {
      borderTopLeftRadius: 4
    },
    fontSize: 12
  },
  content: {
    display: 'flex',
    flexFlow: 'column',
    gap: '4px',
    padding: "8px 4px",
  },
  title: {
    paddingTop: 4,
    fontSize: 14,
    '&.collapsed': {
      paddingTop: 0
    }
  },
  participants: {
    color: theme.palette.secondary.main
  },
  location: {
    color: theme.palette.secondary.main
  },
  fields: {
    position: 'relative',
    display: 'flex',
    flexFlow: 'column',
    gap: '4px 0',
  },
  fieldsWithIconOnly: {
    display: 'flex',
    gap: '0 4px',
    position: 'absolute',
    top: 0,
    right: 0,
    '&.collapsed': {
      position: 'static'
    }
  },
  icon: {
    color: theme.palette.secondary.main,
    '&.error': {
      color: theme.palette.error.main
    }
  },
  topBadge: {
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    color: 'white',
    width: 40,
    display: 'flex',
    justifyContent: 'center',
    gap: '0 8px',
    top: 0,
    left: 0,
    position: 'absolute',
    transform: 'translateY(-100%) translateX(-4px)'
  },
  fieldGroups: {
    display: 'flex',
    flexFlow: 'column',
  }
}));


export interface SingleProps {
  event: ZetkinEvent;
  remindersNotSent: null | number;
  unbookedSignups: null | number;
  height: number;
}

export interface MultiLocationProps {
  events: ZetkinEvent[];
  remindersNotSent: null | number;
  unbookedSignups: null | number;
  height: number;
}

export interface MultiShiftProps {
  events: ZetkinEvent[];
  remindersNotSent: null | number;
  unbookedSignups: null | number;
  height: number;
}


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


enum FIELD_PRESENTATION {
  WITH_LABEL = 'WITH_LABEL',
  ICON_ONLY = 'ICON_ONLY'
}

type Field = Participants | Location | ScheduledTime | RemindersNotSent | UnbookedSignups | NoContactSelected

type PresentableField = Field & {
  presentation: FIELD_PRESENTATION;
}


function createSingleFields(props: SingleProps): Field[] {
  const fields: (Field | null)[] = [
    {
      kind: "Participants",
      requiresAction: props.event.num_participants_required > props.event.num_participants_available,
      message: `${props.event.num_participants_available} / ${props.event.num_participants_required}`
    },
    {
      kind: "Location",
      requiresAction: false,
      message: props.event.location.title
    },
    props.remindersNotSent
      ? {
          kind: "RemindersNotSent",
          requiresAction: true,
          message: `${props.remindersNotSent} reminders not sent`
        }
      : null,
    props.unbookedSignups
        ? {
            kind: "UnbookedSignups",
            requiresAction: true,
            message: `${props.unbookedSignups} unbooked signups`
          }
        : null,
    props.event?.contact
        ? null
        : {
            kind: "NoContactSelected",
            requiresAction: true,
            message: "No contact selected"
          }
  ]

  return fields.filter((field): field is Field => {
    return field !== null;
  })
}

function createMultiLocationFields(props: MultiLocationProps): Field[] {
  const totalRequiredParticipants: number = props.events.reduce((acc, curr) => acc + curr.num_participants_required, 0);
  const totalAvailableParticipants: number = props.events.reduce((acc, curr) => acc + curr.num_participants_available, 0);
  const noContactSelected = props.events.some((event) => !event?.contact)

  const fields: (Field | null)[] = [
    {
      kind: "Participants",
      requiresAction: totalRequiredParticipants > totalAvailableParticipants,
      message: `${totalAvailableParticipants} / ${totalRequiredParticipants}`
    },
    {
      kind: "Location",
      requiresAction: false,
      message: `${props.events.length} different locations`
    },
    props.remindersNotSent
      ? {
          kind: "RemindersNotSent",
          requiresAction: true,
          message: `${props.remindersNotSent} reminders not sent`
        }
      : null,
    props.unbookedSignups
        ? {
            kind: "UnbookedSignups",
            requiresAction: true,
            message: `${props.unbookedSignups} unbooked signups`
          }
        : null,
    noContactSelected
        ? {
            kind: "NoContactSelected",
            requiresAction: true,
            message: "No contact selected"
          }
        : null
  ]

  return fields.filter((field): field is Field => {
    return field !== null;
  })
}

function createMultiShiftFieldGroups(props: MultiShiftProps): Field[][] {
  const fieldGroups: Field[][] = props.events.map((event, index) => {
    const isFirstEvent = index === 0
    let fields: (null | Field)[] = []

    if (isFirstEvent) {
      fields = [
        {
          kind: "Participants",
          requiresAction: event.num_participants_required > event.num_participants_available,
          message: `${event.num_participants_available} / ${event.num_participants_required}`
        },
        {
          kind: "Location",
          requiresAction: false,
          message: event.location.title
        },
        props.remindersNotSent
          ? {
              kind: "RemindersNotSent",
              requiresAction: true,
              message: `${props.remindersNotSent} reminders not sent`
            }
          : null,
        props.unbookedSignups
            ? {
                kind: "UnbookedSignups",
                requiresAction: true,
                message: `${props.unbookedSignups} unbooked signups`
              }
            : null,
        event?.contact
            ? null
            : {
                kind: "NoContactSelected",
                requiresAction: true,
                message: "No contact selected"
              }
      ]
    } else {
      const scheduledTime = `${event.start_time} / ${event.end_time}`;

      fields = [
        {
          kind: "Participants",
          requiresAction: event.num_participants_required > event.num_participants_available,
          message: `${event.num_participants_available} / ${event.num_participants_required}`
        },
        {
          kind: "ScheduledTime",
          requiresAction: false,
          message: scheduledTime
        },
        props.remindersNotSent
          ? {
              kind: "RemindersNotSent",
              requiresAction: true,
              message: `${props.remindersNotSent} reminders not sent`
            }
          : null,
        props.unbookedSignups
            ? {
                kind: "UnbookedSignups",
                requiresAction: true,
                message: `${props.unbookedSignups} unbooked signups`
              }
            : null,
        event?.contact
            ? null
            : {
                kind: "NoContactSelected",
                requiresAction: true,
                message: "No contact selected"
              }
      ]
    }

    return fields.filter((field): field is Field => {
      return field !== null;
    })
  })

  return fieldGroups;
}

function fieldsToPresent(fields: Field[], availableHeight: number): PresentableField[] {
  const numberOfFieldsToShow = numberOfFieldsThatCanBeShown(availableHeight)

  let fieldPresentations: PresentableField[] = []

  if (numberOfFieldsToShow === 0) {
    fieldPresentations =
      fields
        .filter(field => field.requiresAction)
        .map(field => ({
          ...field,
          presentation: FIELD_PRESENTATION.ICON_ONLY,
        }))
  } else {
    let remainingFieldsToShow = numberOfFieldsToShow;

    fields.forEach(field => {
      const shouldBeCollapsed = field.requiresAction

      if (remainingFieldsToShow === 0 && shouldBeCollapsed) {
        fieldPresentations.push({
          ...field,
          presentation: FIELD_PRESENTATION.ICON_ONLY,
        })
      } else if (remainingFieldsToShow > 0) {
        fieldPresentations.push({
          ...field,
          presentation: FIELD_PRESENTATION.WITH_LABEL,
        })

        remainingFieldsToShow--;
      }
    })
  }

  return fieldPresentations;
}

export const Single = (props: SingleProps) => {
  const fields = fieldsToPresent(createSingleFields(props), props.height)

  return (
    <Event
      title={props.event.title || ''}
      height={props.height}
      cancelled={Boolean(props.event?.cancelled)}
      fieldGroups={[ fields ]}
    />
  )
}

export const MultiLocation = (props: MultiLocationProps) => {
  const fields = fieldsToPresent(createMultiLocationFields(props), props.height)
  const firstEventTitle = props.events[0].title
  const anyEventIsCancelled = props.events.some(event => event?.cancelled)

  return (
    <Event
      topBadge={
        <TopBadge
          icon={<ScheduleOutlined color="inherit" fontSize="inherit"/>}
          text={props.events.length.toString()}
        />
      }
      title={firstEventTitle || ''}
      height={props.height}
      cancelled={anyEventIsCancelled}
      fieldGroups={[ fields ]}
    />
  )
}

export const MultiShift = (props: MultiShiftProps) => {
  const firstEventTitle = props.events[0].title
  const anyEventIsCancelled = props.events.some(event => event?.cancelled)
  const availableHeightPerFieldGroup = availableHeightByEvent(props.height, props.events.length);
  const fieldGroups = createMultiShiftFieldGroups(props).map((group, groupIndex) => {
    return fieldsToPresent(group, availableHeightPerFieldGroup[groupIndex]).map(field => {
      const fieldShouldBeCollapsed = field.requiresAction && field.kind !== 'Participants'

      return fieldShouldBeCollapsed
        ? { ...field, presentation: FIELD_PRESENTATION.ICON_ONLY }
        : field
    })
  })

  return (
    <Event
      topBadge={
        <TopBadge
          icon={<ScheduleOutlined color="inherit" fontSize="inherit"/>}
          text={props.events.length.toString()}
        />
      }
      title={firstEventTitle || ''}
      height={props.height}
      cancelled={anyEventIsCancelled}
      fieldGroups={fieldGroups}
    />
  )
}


interface EventProps {
  topBadge?: JSX.Element;
  title: string;
  fieldGroups: PresentableField[][];
  height: number;
  cancelled: boolean;
}


const Event = (props: EventProps) => {
  const classes = useStyles()
  const allFieldsAreCollapsed = !props.fieldGroups.some(group => {
    return group.some(field => field.presentation === FIELD_PRESENTATION.WITH_LABEL)
  })
  const availableHeightPerFieldGroup = availableHeightByEvent(props.height, props.fieldGroups.length);

  if (allFieldsAreCollapsed) {
    const collapsedFields: PresentableField[] = allCollapsedPresentableFields(props.fieldGroups)

    return (
      <div
        className={classes.container + ' collapsed'}
        style={{
          height: props.height,
          justifyContent: 'space-between',
          borderTopLeftRadius: props.topBadge ? '0px' :'4px'
        }}
      >
        {props.topBadge}
        <span className={classes.title + (allFieldsAreCollapsed ? ' collapsed' : '')}>{ props.title }</span>
        <div
          style={{
            display: 'flex',
            gap: '0 4px'
          }}
        >
          {collapsedFields.map(field => {
            return (
              <Field field={field} />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div
      className={classes.container}
      style={{
        height: props.height,
        borderTopLeftRadius: props.topBadge ? '0px' :'4px'
      }}
    >
      {props.topBadge}
      <span className={classes.title}>{ props.title }</span>
      <div className={classes.fieldGroups}>
        {props.fieldGroups
          .map((fields, index) => (
            <FieldGroup
              height={availableHeightPerFieldGroup[index]}
              fields={fields}
              index={index}
            />
          ))
        }
      </div>
    </div>
  )
}


const FieldGroup = ({ fields, height, index }: { fields: PresentableField[], height: number, index: number }) => {
  const classes = useStyles()
  const fieldsWithLabel = fields.filter(f => f.presentation === FIELD_PRESENTATION.WITH_LABEL)
  const fieldsWithIconOnly = fields.filter(f => f.presentation === FIELD_PRESENTATION.ICON_ONLY)
  const isFirstFieldGroup = index === 0;

  return (
    <div
      className={classes.fields}
      style={{
        height,
        borderTop: isFirstFieldGroup ? '' : 'solid 1px gray',
        paddingTop: isFirstFieldGroup ? '' : '4px'
      }}
    >
      <div className={classes.fieldsWithIconOnly}>
        {fieldsWithIconOnly.map((field) => (
          <Field field={field} />
        ))}
      </div>
      {fieldsWithLabel.map((field) => (
        <Field field={field} />
      ))}
    </div>
  )
}


interface FieldProps {
  field: PresentableField;
}

function TopBadge({ icon, text }: { icon : JSX.Element, text: string }) {
  const classes = useStyles()

  return (
    <div className={classes.topBadge}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Field({ field }: FieldProps) {
  const classes = useStyles()
  const labelColor = field.requiresAction ? 'error' : 'secondary';
  const icon = (
    <span
      className={classes.icon + (field.requiresAction ? ' error' : '')}
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <FieldIcon field={field} />
    </span>
  )

  if (field.presentation === FIELD_PRESENTATION.ICON_ONLY) {
    return icon
  }

  return (
    <ZUIIconLabel
      icon={icon}
      label={field.message}
      color={labelColor}
      size="sm"
    />
  )
}

function FieldIcon({ field }: { field: Field }) {
  switch (field.kind) {
    case 'Participants':
      return (<Group color="inherit" fontSize="inherit"/>)

    case 'Location':
      return (<PlaceOutlined color="inherit" fontSize="inherit"/>)

    case 'ScheduledTime':
      return (<ScheduleOutlined color="inherit" fontSize="inherit"/>)

    case 'RemindersNotSent':
      return (<MailOutline color="inherit" fontSize="inherit"/>)

    case 'UnbookedSignups':
      return (<EmojiPeople color="inherit" fontSize="inherit"/>)

    case 'NoContactSelected':
      return (<FaceRetouchingOff color="inherit" fontSize="inherit"/>)
  }
}

const titleHeight = 16;
const fieldHeight = 18;
const containerBottomPadding = 4
const spaceBetweenFields = 4;
const spaceRequiredForField = fieldHeight + spaceBetweenFields

function availableHeightByEvent(totalAvailableHeight: number, numberOfEvents: number ): Record<number, number> {
  const availableHeights: Record<number, number> = {}

  for (let i = 0; i < numberOfEvents; i++) {
    const isFirstEvent = i === 0;

    availableHeights[i] = isFirstEvent
      ? (totalAvailableHeight / numberOfEvents) - titleHeight - containerBottomPadding - spaceBetweenFields
      : (totalAvailableHeight / numberOfEvents)
  }

  return availableHeights
}

function numberOfFieldsThatCanBeShown(availableHeight: number): number {
  let fieldsThatCanBeShown = 0;
  let remainingSpace = availableHeight - titleHeight - containerBottomPadding;

  while (remainingSpace > spaceRequiredForField) {
    const nextRemainingSpace = remainingSpace - spaceRequiredForField;

    fieldsThatCanBeShown++;
    remainingSpace = nextRemainingSpace;
  }

  return fieldsThatCanBeShown;
}

function allCollapsedPresentableFields(fieldGroups: PresentableField[][]): PresentableField[] {
  const fields: Record<string, PresentableField> = {}

  fieldGroups.forEach(group => {
    group.forEach(field => {
      if (!(field.kind in fields)) {
        fields[field.kind] = field
      }
    })
  })

  return Object.values(fields)
}