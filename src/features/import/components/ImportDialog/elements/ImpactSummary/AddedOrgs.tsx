import { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinOrganization } from 'utils/types/zetkin';

interface AddedOrgsProps {
  numPeopleWithOrgsAdded: number;
  orgsWithNewPeople: {
    adding: number;
    org: Pick<ZetkinOrganization, 'title' | 'id'>;
  }[];
  tense: 'past' | 'future';
}

const AddedOrgs: FC<AddedOrgsProps> = ({
  numPeopleWithOrgsAdded,
  orgsWithNewPeople,
  tense,
}) => {
  const theme = useTheme();
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
          id={messageIds.impactSummary[tense].orgs}
          values={{
            numPeople: (
              <Typography
                component="span"
                marginRight={0.5}
                sx={{ display: 'flex' }}
              >
                <Msg
                  id={messageIds.impactSummary.people}
                  values={{
                    numPeople: numPeopleWithOrgsAdded,
                    number: (
                      <Typography fontWeight="bold" sx={{ marginRight: 0.5 }}>
                        {numPeopleWithOrgsAdded}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            ),
            org: (
              <Typography fontWeight="bold" sx={{ marginX: 0.5 }}>
                <Msg id={messageIds.impactSummary[tense].organization} />
              </Typography>
            ),
          }}
        />
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={0.5}>
        {orgsWithNewPeople.map((org, index) => (
          <Typography key={org.org.id} color="secondary">
            <Msg
              id={messageIds.impactSummary.peopleToSubOrg}
              values={{
                num: org.adding,
                orgName: org.org.title,
              }}
            />
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
