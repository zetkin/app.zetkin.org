import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.areas', {
  empty: {
    description: m('Empty description'),
    title: m('Untitled area'),
  },
  overlay: {
    buttons: {
      cancel: m('Cancel'),
      edit: m('Edit'),
      save: m('Save'),
    },
  },
  tools: {
    cancel: m('Cancel'),
    draw: m('Draw'),
    save: m('Save'),
  },
});
