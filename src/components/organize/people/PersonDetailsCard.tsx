import NextLink from 'next/link';
import { OpenInNew } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { Button, Card, Link, ListItem, ListItemText } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import ZetkinDate from 'components/ZetkinDate';
import ZetkinList from 'components/ZetkinList';
import ZetkinSection from 'components/ZetkinSection';
import { ZetkinCustomField, ZetkinPerson } from 'types/zetkin';

const PersonDetailLink: React.FunctionComponent<{
  href: string;
}> = ({ children, href }) => (
  <NextLink href={href} passHref>
    <Link>{children}</Link>
  </NextLink>
);

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
  'ext_id',
];

const PersonDetailsCard: React.FunctionComponent<{
  customFields: ZetkinCustomField[];
  person: ZetkinPerson;
}> = ({ customFields, person }) => {
  const intl = useIntl();
  const router = useRouter();

  const nativeFields = nativeFieldsToDisplay.map((field) => {
    let value: string | React.ReactNode = person[field];

    if (field === 'gender' && person.gender) {
      // Localise gender field
      value = intl.formatMessage({
        id: 'misc.person.genders.' + (person.gender || 'unknown'),
      });
    } else if (field === 'phone' && person.phone) {
      value = (
        <PersonDetailLink href={`tel:${person.phone}`}>
          {person.phone}
        </PersonDetailLink>
      );
    } else if (field === 'email' && person.email) {
      value = (
        <PersonDetailLink href={`mailto:${person.email}`}>
          {person.email}
        </PersonDetailLink>
      );
    }

    return {
      title: intl.formatMessage({
        id: 'misc.person.fields.' + field,
      }),
      value,
    };
  });

  const customFieldsConfig = customFields
    .filter((field) => field.type !== 'json')
    .map((field) => {
      let value: string | React.ReactNode = person[field.slug];
      if (value && field.type === 'date') {
        value = <ZetkinDate datetime={value as string} />;
      } else if (value && field.type === 'url') {
        value = (
          <PersonDetailLink href={value as string}>{value}</PersonDetailLink>
        );
      }

      return {
        title: field.title,
        value,
      };
    });

  const allFields = [...nativeFields, ...customFieldsConfig];

  return (
    <ZetkinSection
      action={
        <NextLink href={`${router.asPath}/edit`} passHref>
          <Button color="primary" startIcon={<OpenInNew />}>
            <FormattedMessage id="misc.person.editButtonLabel" />
          </Button>
        </NextLink>
      }
      title={intl.formatMessage({ id: 'pages.people.person.details.title' })}
    >
      <Card>
        <ZetkinList initialLength={4} showMoreStep={allFields.length - 4}>
          {allFields.map((detail, idx) => (
            <ListItem key={idx} divider>
              <ListItemText
                primary={detail.value || '-'}
                secondary={detail.title}
              />
            </ListItem>
          ))}
        </ZetkinList>
      </Card>
    </ZetkinSection>
  );
};

export default PersonDetailsCard;
