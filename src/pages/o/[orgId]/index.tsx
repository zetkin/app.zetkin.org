import { Avatar, Box, Button, Link, Stack, Typography } from '@mui/material';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useMemberships from 'features/campaigns/hooks/useMemberships';
import useOrganization from 'features/organizations/hooks/useOrganization';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import useFollowMutations from 'features/user/hooks/useFollowMutations';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import messageIds from 'features/user/l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIAvatar from 'zui/ZUIAvatar';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import ActivistCampaignCard from 'features/campaigns/components/ActivistCampaignCard';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import dayjs from 'dayjs';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  return {
    props: {
      orgId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  orgId: string;
};

const Page: FC<PageProps> = ({ orgId }) => {
  const startOfToday = new Date(new Date().toISOString().slice(0, 10));
  const weekFromNow = new Date(startOfToday);
  weekFromNow.setDate(startOfToday.getDate() + 8);

  const events = useEventsFromDateRange(startOfToday, weekFromNow);
  const { data: organization } = useOrganization(Number(orgId));
  const { data: subOrgs } = useSubOrganizations(Number(orgId));
  const { data: projects } = useCampaigns(Number(orgId));
  const surveys = useSurveys(Number(orgId));
  const { data: memberships } = useMemberships();
  const { followOrg, unFollowOrg } = useFollowMutations(parseInt(orgId));

  const currentOrgMemberhip = memberships?.find(
    (m) => m.organization.id == Number(orgId)
  );
  const isFollowingCurrentOrg = currentOrgMemberhip?.follow;
  messageIds;

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <ZUIAvatar size={'lg'} url={organization?.avatar_file?.url ?? ''} />
        <Box display="flex" alignItems="start" flexDirection="column">
          {organization?.parent && (
            <Link href={`/o/${organization?.parent?.id}`}>
              {organization?.parent.title}
            </Link>
          )}
          <Typography variant="h4">{organization?.title}</Typography>
        </Box>
        <Box>
          {!isFollowingCurrentOrg && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                followOrg();
              }}
            >
              <Msg id={messageIds.follow} />
            </Button>
          )}
        </Box>
        {subOrgs?.map((org) => (
          <Box display="flex" flexDirection="row">
            <ZUIAvatar size={'sm'} url={org?.avatar_file?.url ?? ''} />
            <Link href={`/o/${org.id}`}>{org.title}</Link>
          </Box>
        ))}
      </Box>
      <Stack spacing={2}>
        {projects?.map((pro) => (
          <ActivistCampaignCard campaign={pro} />
        ))}
      </Stack>
      <Box>
        {isFollowingCurrentOrg && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              unFollowOrg();
            }}
          >
            <Msg id={messageIds.unfollow} />
          </Button>
        )}
      </Box>
    </>
  );
};

export default Page;
