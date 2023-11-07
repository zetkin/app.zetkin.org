import { Box } from '@mui/system';
import { Typography } from '@mui/material';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'features/import/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinCustomField,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';

interface ImportChangeTrackerProps {
  orgsStates?: { orgs: string[]; updatedNum: number };
  fields?: {
    [key in
      | keyof Partial<ZetkinPersonNativeFields>
      | keyof Partial<ZetkinCustomField>]?: number;
  };
  orgId: number;
}

const ImportChangeTracker: React.FunctionComponent<
  ImportChangeTrackerProps
> = ({ orgsStates, fields, orgId }) => {
  const organizations = useOrganizations();
  const customFields = useCustomFields(orgId).data ?? [];
  const globalMessages = useMessages(globalMessageIds);

  if (orgsStates !== undefined && orgsStates.orgs.length === 0) {
    return null;
  }

  const orgsWithNewPeople = organizations.data?.filter((item) =>
    orgsStates?.orgs.some((org) => org === item.id.toString())
  );
  const nativeFields = Object.values(NATIVE_PERSON_FIELDS) as string[];

  return (
    <>
      {fields &&
        Object.entries(fields).map((entry) => {
          return (
            <Box
              key={entry[0]}
              sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}
            >
              <Box alignItems="center" display="flex">
                <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
                  {entry[1]}
                </Typography>
                <Msg id={messageIds.validation.trackers.defaultDesc} />
                <Typography fontWeight="bold" sx={{ ml: 0.5 }}>
                  {nativeFields.includes(entry[0])
                    ? globalMessages.personFields[
                        entry[0] as NATIVE_PERSON_FIELDS
                      ]()
                    : customFields.find((item) => item.slug === entry[0])
                        ?.title}
                </Typography>
              </Box>
            </Box>
          );
        })}
      {orgsStates && (
        <Box sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}>
          <Box alignItems="center" display="flex">
            <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
              {orgsStates.updatedNum}
            </Typography>
            <Msg id={messageIds.validation.trackers.orgs} />
            <Typography fontWeight="bold" sx={{ ml: 0.5 }}>
              <Msg id={messageIds.validation.organization} />
            </Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {orgsWithNewPeople?.map((org, index) => (
              <Typography key={org.id} color="secondary">
                {org.title}
                {orgsWithNewPeople.length === 1 ||
                orgsWithNewPeople.length - 1 === index
                  ? ''
                  : ','}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};
export default ImportChangeTracker;
