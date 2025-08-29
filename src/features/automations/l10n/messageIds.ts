import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.automations', {
  defaultTitle: m('Untitled job'),
  itemPage: {
    pauseButton: m('Pause'),
    scheduling: {
      activateButton: m('Activate'),
      interval: {
        description: m(
          'The job will repeat indefintely, waiting for this amount of time between each iteration.'
        ),
        unitLabel: m('Unit'),
        units: {
          days: m('days'),
          hours: m('hours'),
          minutes: m('minutes'),
        },
        valueLabel: m('Interval'),
      },
    },
    schedulingButton: m('Schedule'),
    targeting: {
      header: m('Targeting'),
      smartSearchButton: m('Configure'),
    },
  },
  labels: {
    lastRun: {
      never: m('Not run yet'),
      relative: m<{ relative: JSX.Element }>('Last run {relative}'),
    },
    schedule: {
      interval: m<{ seconds: number }>('Every {seconds} seconds'),
    },
    status: {
      active: m('Active'),
      inactive: m('Inactive'),
    },
  },
  listPage: {
    createButton: m('Create job'),
    subtitle: m<{ numActive: number; numTotal: number }>(
      '{numActive, plural, =1 {# active job} other {# active jobs}} ({numTotal} total)'
    ),
    title: m('Automation'),
  },
  opConfig: {
    header: m('Actions'),
    opTypeLabel: m('Action type'),
    opTypes: {
      addToOrg: {
        subOrgLabel: m('Sub-organization'),
        typeLabel: m('Add to sub-organization'),
      },
      setFields: {
        fieldLabel: m('Field to update'),
        typeLabel: m('Set field'),
        valueLabel: m('New value'),
      },
      tag: {
        tagLabel: m('Tag'),
        typeLabel: m('Apply tag'),
      },
    },
  },
});
