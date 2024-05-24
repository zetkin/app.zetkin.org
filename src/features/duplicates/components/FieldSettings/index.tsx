import { FC } from 'react';

import FieldSettingsRow from './FieldSettingsRow';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { ZetkinPerson } from 'utils/types/zetkin';

interface FieldSettingsProps {
  duplicatePersons: ZetkinPerson[];
}

const FieldSettings: FC<FieldSettingsProps> = ({ duplicatePersons }) => {
  return (
    <>
      {Object.values(NATIVE_PERSON_FIELDS).map((field) => {
        const values = duplicatePersons.map((person) => {
          const value = person[field];
          return value ? value.toString() : '';
        });

        return <FieldSettingsRow key={field} field={field} values={values} />;
      })}
    </>
  );
};

export default FieldSettings;
