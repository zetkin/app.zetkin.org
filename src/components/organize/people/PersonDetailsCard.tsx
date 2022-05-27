import NextLink from 'next/link';
import { useIntl } from 'react-intl';
import { Link, ListItem, ListItemText } from '@material-ui/core';

import PersonCard from './PersonCard';
import ZetkinDate from 'components/ZetkinDate';
import ZetkinList from 'components/ZetkinList';
import { ZetkinCustomField, ZetkinPerson } from 'types/zetkin';

const nativeFieldsToDisplay = [
  'first_name',
  'last_name',
  'email',
  'phone',
  'alt_phone',
  'street_address',
  'city',
  'zip_code',
  'country',
  'gender',
];

const PersonDetailsCard: React.FunctionComponent<{
  customFields: ZetkinCustomField[];
  person: ZetkinPerson;
}> = ({ customFields, person }) => {
  const intl = useIntl();

  const nativeFields = nativeFieldsToDisplay.map((field) => ({
    title: intl.formatMessage({
      id: 'misc.person.fields.' + field,
    }),
    value:
      field === 'gender' && person.gender
        ? intl.formatMessage({
            id: 'misc.person.genders.' + (person.gender || 'unknown'),
          })
        : person[field],
  }));

  const customFieldsConfig = customFields
    .filter((field) => field.type !== 'json')
    .map((field) => {
      let value: string | React.ReactNode = person[field.slug];
      if (value && field.type === 'date') {
        value = <ZetkinDate datetime={value as string} />;
      } else if (value && field.type === 'url') {
        value = (
          <NextLink href={value as string} passHref>
            <Link>{value}</Link>
          </NextLink>
        );
      }

      return {
        title: field.title,
        value,
      };
    });

  const allFields = [...nativeFields, ...customFieldsConfig].sort(
    // Sort so that items with values are shown first
    (first, second) => {
      if (first.value && !second.value) {
        return -1;
      }
      if (!first.value && second.value) {
        return 1;
      }
      return 0;
    }
  );

  return (
    <PersonCard titleId="pages.people.person.details.title">
      <ZetkinList
        initialLength={allFields.filter((field) => !!field.value).length}
        showMoreStep={allFields.filter((field) => !field.value).length}
        showMoreText="Show empty..."
      >
        {allFields.map((detail, idx) => (
          <ListItem key={idx} divider>
            <ListItemText
              primary={detail.value || '-'}
              secondary={detail.title}
            />
          </ListItem>
        ))}
      </ZetkinList>
    </PersonCard>
  );
};

export default PersonDetailsCard;
