import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';

import {
  ZetkinCreatePerson,
  ZetkinCustomField,
  ZetkinPerson,
} from 'utils/types/zetkin';

type PersonFormData = ZetkinCreatePerson | ZetkinPerson;

export default function checkInvalidFields(
  customFields: ZetkinCustomField[],
  personalInfo: PersonFormData,
  countryCode: CountryCode
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
  if (
    personalInfo.phone &&
    !isValidPhoneNumber(personalInfo.phone || '', countryCode)
  ) {
    invalidFields.push('phone');
  }

  if (
    personalInfo.alt_phone &&
    !isValidPhoneNumber(personalInfo.alt_phone || '', countryCode)
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
