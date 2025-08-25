import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.automations', {
  defaultTitle: m('Untitled automation'),
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
    createButton: m('Create automation'),
    subtitle: m<{ numActive: number; numTotal: number }>(
      '{numActive, plural, =1 {# active automation} other {# active automations}} ({numTotal} total)'
    ),
    title: m('Automation'),
  },
});
