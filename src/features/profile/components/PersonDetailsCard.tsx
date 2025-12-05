import NextLink from 'next/link';
import { useState } from 'react';
import {
  Button,
  Card,
  Link,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';

import EditPersonDialog from './EditPersonDialog';
import globalMessageIds from 'core/i18n/messageIds';
import messageIds from '../l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import ZUIDate from 'zui/ZUIDate';
import ZUIList from 'zui/ZUIList';
import ZUISection from 'zui/ZUISection';
import { Msg, useMessages } from 'core/i18n';
import {
  CUSTOM_FIELD_TYPE,
  ZetkinCustomField,
  ZetkinPerson,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';
import { PersonWithUpdates } from '../types/PersonWithUpdates';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

const PersonDetailLink: React.FunctionComponent<{
  children: React.ReactNode;
  href: string;
}> = ({ children, href }) => (
  <NextLink href={href} legacyBehavior passHref>
    <Link underline="hover">{children}</Link>
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
] as const;

const ChangedDateTooltip: React.FunctionComponent<{
  field: string;
  person: PersonWithUpdates & ZetkinPerson;
}> = ({ person, field }) => {
  const changedDate = (person as PersonWithUpdates)._history?.fields?.[
    field as keyof ZetkinPersonNativeFields
  ];

  if (!changedDate) {
    return <>?</>;
  }

  if (dayjs().diff(dayjs(changedDate), 'day') > 30) {
    return (
      <>
        <Msg id={messageIds.changedDateTooltip} />{' '}
        <ZUIDate datetime={changedDate} />
      </>
    );
  }

  return (
    <>
      <Msg id={messageIds.changedDateTooltip} />{' '}
      <ZUIRelativeTime datetime={changedDate} />
    </>
  );
};

const PersonDetailsCard: React.FunctionComponent<{
  customFields: ZetkinCustomField[];
  person: PersonWithUpdates & ZetkinPerson;
}> = ({ customFields, person }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const globalMessages = useMessages(globalMessageIds);
  const [editPersonDialogOpen, setEditPersonDialogOpen] = useState(false);

  const nativeFields = nativeFieldsToDisplay.map((field) => {
    // NAtive fields are never objects
    let value: string | React.ReactNode = person[field] as
      | string
      | React.ReactNode;

    if (field === 'gender' && person.gender) {
      // Localise gender field
      value = messages.genders[person.gender || 'unknown']();
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
      field,
      title: globalMessages.personFields[field](),
      value,
    };
  });

  const customFieldsConfig = customFields
    .filter(
      (field) =>
        field.type != CUSTOM_FIELD_TYPE.JSON &&
        field.type != CUSTOM_FIELD_TYPE.LNGLAT
    )
    .map((field) => {
      // Object type is filtered above
      let value: string | React.ReactNode = person[field.slug] as
        | string
        | React.ReactNode;
      if (value && field.type === CUSTOM_FIELD_TYPE.DATE) {
        value = <ZUIDate datetime={value as string} />;
      } else if (value && field.type === CUSTOM_FIELD_TYPE.URL) {
        value = (
          <PersonDetailLink href={value as string}>{value}</PersonDetailLink>
        );
      } else if (
        value &&
        field.type == CUSTOM_FIELD_TYPE.ENUM &&
        field.enum_choices
      ) {
        const enumItem = field.enum_choices.find((c) => c.key == value);
        if (enumItem) {
          value = enumItem.label;
        }
      }

      return {
        field: field.slug,
        title: field.title,
        value,
      };
    });

  const allFields = [...nativeFields, ...customFieldsConfig];

  return (
    <>
      <EditPersonDialog
        onClose={() => setEditPersonDialogOpen(false)}
        open={editPersonDialogOpen}
        orgId={orgId}
        person={person}
      />
      <ZUISection
        action={
          <Button onClick={() => setEditPersonDialogOpen(true)}>
            <Msg id={messageIds.editButtonLabel} />
          </Button>
        }
        title={messages.details.title()}
      >
        <Card>
          <ZUIList initialLength={4} showMoreStep={allFields.length - 4}>
            {allFields.map((detail, idx) => (
              <ListItem key={idx} divider>
                <Tooltip
                  placement="bottom"
                  title={
                    <ChangedDateTooltip field={detail.field} person={person} />
                  }
                >
                  <ListItemText
                    primary={detail.value || '-'}
                    secondary={detail.title}
                  />
                </Tooltip>
              </ListItem>
            ))}
          </ZUIList>
        </Card>
      </ZUISection>
    </>
  );
};

export default PersonDetailsCard;
