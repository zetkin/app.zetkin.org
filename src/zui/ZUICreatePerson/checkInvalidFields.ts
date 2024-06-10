import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { isValidPhoneNumber } from 'libphonenumber-js';

import { ZetkinCreatePerson, ZetkinCustomField } from 'utils/types/zetkin';

export default function checkInvalidFields(
  customFields: ZetkinCustomField[],
  personalInfo: ZetkinCreatePerson
) {
  let invalidFields: string[] = [];

  //name
  if (personalInfo.first_name === '') {
    invalidFields.push('first_name');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'first_name');
  }

  if (personalInfo.last_name === '') {
    invalidFields.push('last_name');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'last_name');
  }

  //email
  if (personalInfo.email && !isEmail(personalInfo.email || '')) {
    invalidFields.push('email');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'email');
  }

  //phones
  if (personalInfo.phone && !isValidPhoneNumber(personalInfo.phone || '')) {
    invalidFields.push('phone');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'phone');
  }
  if (
    personalInfo.alt_phone &&
    !isValidPhoneNumber(personalInfo.alt_phone || '')
  ) {
    invalidFields.push('alt_phone');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'alt_phone');
  }
  //urls;

  customFields.forEach((field) => {
    if (field.type === 'url') {
      const slug = field.slug;
      if (personalInfo[slug] && !isURL(personalInfo[slug] || '')) {
        invalidFields.push(slug);
      } else {
        invalidFields = invalidFields.filter((item) => item !== slug);
      }
    }
  });

  return invalidFields;
}
