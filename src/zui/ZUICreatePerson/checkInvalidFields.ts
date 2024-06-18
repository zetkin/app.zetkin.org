import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { isValidPhoneNumber } from 'libphonenumber-js';

import { ZetkinCreatePerson, ZetkinCustomField } from 'utils/types/zetkin';

export default function checkInvalidFields(
  customFields: ZetkinCustomField[],
  personalInfo: ZetkinCreatePerson
) {
  const invalidFields: string[] = [];

  //name
  if (personalInfo.first_name === '') {
    invalidFields.push('first_name');
  }

  if (personalInfo.last_name === '') {
    invalidFields.push('last_name');
  }

  //email
  if (personalInfo.email && !isEmail(personalInfo.email || '')) {
    invalidFields.push('email');
  }

  //phones
  if (personalInfo.phone && !isValidPhoneNumber(personalInfo.phone || '')) {
    invalidFields.push('phone');
  }

  if (
    personalInfo.alt_phone &&
    !isValidPhoneNumber(personalInfo.alt_phone || '')
  ) {
    invalidFields.push('alt_phone');
  }

  //urls
  customFields.forEach((field) => {
    if (field.type === 'url') {
      const slug = field.slug;
      if (personalInfo[slug] && !isURL(personalInfo[slug] || '')) {
        invalidFields.push(slug);
      }
    }
  });

  return invalidFields;
}
