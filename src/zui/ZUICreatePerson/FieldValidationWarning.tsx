import { FC } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';

interface FieldValidationWarningProps {
  isURLField?: boolean;
  field: string;
}

const FieldValidationWarning: FC<FieldValidationWarningProps> = ({
  isURLField,
  field,
}) => {
  let id;

  if (isURLField) {
    id = messageIds.createPerson.validationWarning.url;
  } else if (field === 'first_name' || field === 'last_name') {
    id = messageIds.createPerson.validationWarning.name;
  } else if (field === 'alt_phone' || field === 'phone') {
    id = messageIds.createPerson.validationWarning.phone;
  } else {
    id = messageIds.createPerson.validationWarning.email;
  }
  return <Msg id={id} />;
};

export default FieldValidationWarning;
