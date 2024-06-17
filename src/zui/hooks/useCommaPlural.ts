import { InterpolatedMessage, useMessages } from 'core/i18n';

type Messages = {
  few: InterpolatedMessage<{ first: string; last: string }>;
  many: InterpolatedMessage<{ additional: number; first: string }>;
  single: InterpolatedMessage<{ value: string }>;
};

export default function useCommaPlural(
  values: string[],
  max: number,
  messages: Messages
) {
  const messageFuncs = useMessages(messages);

  const maxCommaValues = max - 1;

  if (values.length == 0) {
    return '';
  } else if (values.length == 1) {
    return messageFuncs.single({ value: values[0] });
  } else if (values.length > maxCommaValues + 1) {
    const commaValues = values.slice(0, maxCommaValues);
    const first = commaValues.join(', ');
    const additional = values.length - commaValues.length;
    return messageFuncs.many({ additional, first });
  } else {
    const first = values.slice(0, -1).join(', ');
    const last = values[values.length - 1];
    return messageFuncs.few({ first: first, last: last });
  }
}
