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
import useOrgPageData from 'features/user/hooks/useOrgPageData';
import ZUIFuture from 'zui/ZUIFuture';

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
  const future = useOrgPageData(Number(orgId));
  setTimeout(() => {
    console.log(future);
  }, 5000);

  const { followOrg, unFollowOrg } = useFollowMutations(parseInt(orgId));

  return (
    <ZUIFuture future={future}>
      {({ memberships, org, subOrgs, projects, surveys, events }) => {
        const currentOrgMemberhip = memberships?.find(
          (m) => m.organization.id == Number(orgId)
        );
        const isFollowingCurrentOrg = currentOrgMemberhip?.follow;
        return (
          <>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ backgroundColor: 'beige', height: '300px', mt: 2 }}
            >
              <Box alignItems="center" display="flex" flexDirection="column">
                <ZUIAvatar size={'xl'} url={org?.avatar_file?.url ?? ''} />
                <Box
                  display="flex"
                  alignItems="start"
                  flexDirection="column"
                  sx={{ mt: 2 }}
                >
                  {org?.parent && (
                    <Link href={`/o/${org?.parent?.id}`}>
                      {org?.parent.title}
                    </Link>
                  )}
                  <Typography variant="h5">{org?.title}</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center">
                <Button
                  variant={isFollowingCurrentOrg ? 'outlined' : 'contained'}
                  color="primary"
                  onClick={() => {
                    if (isFollowingCurrentOrg) {
                      unFollowOrg();
                    } else {
                      followOrg();
                    }
                  }}
                  sx={{ my: 2 }}
                >
                  <Msg
                    id={
                      isFollowingCurrentOrg
                        ? messageIds.unfollow
                        : messageIds.follow
                    }
                  />
                </Button>
              </Box>
              <Stack spacing={1}>
                {subOrgs?.map((org, index) => (
                  <Box key={org.id} display="flex" justifyContent="center">
                    <ZUIAvatar size={'sm'} url={org?.avatar_file?.url ?? ''} />
                    <Link href={`/o/${org.id}`} sx={{ ml: 1 }}>
                      {org.title}
                    </Link>
                  </Box>
                ))}
              </Stack>
            </Box>
            <Stack spacing={2}>
              {projects?.map((pro) => (
                <Box key={pro.id}>
                  <ActivistCampaignCard
                    campaign={pro}
                    events={events.filter((e) => e.campaign?.id === pro.id)}
                  />
                </Box>
              ))}
            </Stack>
            <Typography variant="h4">
              <Msg id={messageIds.surveys} />
            </Typography>
            <Stack direction="column">
              {surveys.map((survey) => {
                return (
                  <Link
                    key={survey.id}
                    href={`/o/${org.id}/campaigns/${
                      survey.campaign?.id ?? 'standalone'
                    }/surveys/${survey.id}`}
                  >
                    {survey.title}
                  </Link>
                );
              })}
            </Stack>
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default Page;
