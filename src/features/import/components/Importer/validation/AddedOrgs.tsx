import { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { AddedOrgsSummary } from 'features/import/utils/getAddedOrgsSummary';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import useOrganizations from 'features/organizations/hooks/useOrganizations';

interface AddedOrgsProps {
  addedOrgsSummary: AddedOrgsSummary;
}

const AddedOrgs: FC<AddedOrgsProps> = ({ addedOrgsSummary }) => {
  const theme = useTheme();
  const organizationsFuture = useOrganizations();

  const orgsWithNewPeople = organizationsFuture.data?.filter((item) =>
    addedOrgsSummary.orgs.some((org) => org == item.id.toString())
  );

  if (addedOrgsSummary && addedOrgsSummary.orgs.length == 0) {
    return null;
  }

  return (
    <Box
      border={1}
      borderColor={theme.palette.grey[300]}
      borderRadius={1}
      padding={2}
    >
      <Typography
        component="span"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <Msg
          id={messageIds.validation.updateOverview.orgs}
          values={{
            numPeople: (
              <Typography
                component="span"
                marginRight={0.5}
                sx={{ display: 'flex' }}
              >
                <Msg
                  id={messageIds.validation.updateOverview.people}
                  values={{
                    numPeople: addedOrgsSummary.numCreated,
                    number: (
                      <Typography fontWeight="bold" sx={{ marginRight: 0.5 }}>
                        {addedOrgsSummary.numCreated}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            ),
            org: (
              <Typography fontWeight="bold" sx={{ marginX: 0.5 }}>
                <Msg id={messageIds.validation.updateOverview.organization} />
              </Typography>
            ),
          }}
        />
      </Typography>
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
  );
};

export default AddedOrgs;
