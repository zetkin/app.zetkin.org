import Fuse from 'fuse.js';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  ReactElement,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';

import ActivitiesOverview, {
  ActivitiesOverviewSkeleton,
} from 'features/projects/components/ActivitiesOverview';
import AllProjectsLayout from 'features/projects/layout/AllProjectsLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import ProjectCard from 'features/projects/components/ProjectCard';
import messageIds from 'features/projects/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SharedCard from 'features/projects/components/SharedCard';
import useProjects from 'features/projects/hooks/useProjects';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { Msg, useMessages } from 'core/i18n';
import ZUINumberChip from 'zui/ZUINumberChip';
import { ZetkinProject } from 'utils/types/zetkin';
import useActivitiyOverview from 'features/projects/hooks/useActivityOverview';
import ZUIFutures from 'zui/ZUIFutures';
import { IFuture } from 'core/caching/futures';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'pages.organizeAllProjects',
    'misc.formDialog',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const orgState = await apiClient.get(`/api/orgs/${orgId}`);

  if (orgState) {
    return {
      props: {},
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const LoadingPageIndicator = () => {
  const messages = useMessages(messageIds);

  return (
    <>
      <Head>
        <title>{messages.layout.allProjects()}</title>
      </Head>
      <ActivitiesOverviewSkeleton />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 8,
        }}
      >
        <Typography sx={{ maxWidth: '100%' }} variant="h4">
          <Skeleton sx={{ maxWidth: '100%' }} width={'400px'} />
        </Typography>
      </Box>
      <Box component="section" mt={4} sx={{ maxWidth: '100%' }}>
        <Box
          component="header"
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: 1,
          }}
        >
          <Typography mb={2} sx={{ maxWidth: '100%' }} variant="h5">
            <Skeleton sx={{ maxWidth: '100%' }} width={'100px'} />
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {new Array(8).fill(0).map((project, index) => (
            <Grid key={index} size={{ lg: 3, md: 4, xs: 12 }}>
              <Skeleton sx={{ height: '117px' }} variant={'rounded'} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

function LoadingBoundary<G extends Record<string, unknown>>({
  children,
  futures,
}: {
  children: ReactElement;
  futures: { [I in keyof G]: IFuture<G[I]> };
}) {
  return (
    <Suspense fallback={<LoadingPageIndicator />}>
      <ZUIFutures futures={futures} loadingIndicator={<LoadingPageIndicator />}>
        {children}
      </ZUIFutures>
    </Suspense>
  );
}

const AllProjectsSummaryPage: PageWithLayout = () => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const projectsFuture = useProjects(orgId);
  const surveysFuture = useSurveys(orgId);
  const activityOverviewFuture = useActivitiyOverview(orgId);

  const projects = projectsFuture.data || [];
  projects.reverse();
  const [searchString, setSearchString] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const archivedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (archivedRef.current) {
      archivedRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showArchived]);

  const onServer = useServerSide();
  const surveys = surveysFuture.data ?? [];

  const search = () => {
    const fuse = new Fuse(projects, {
      keys: ['title', 'info_text'],
      threshold: 0.4,
    });

    return fuse.search(searchString).map((fuseResult) => fuseResult.item);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const projectsThatMatchSearch = useMemo(() => search(), [searchString]);

  const [activeProjects, archivedProjects] = useMemo(() => {
    let archived: ZetkinProject[] = [];
    let active: ZetkinProject[] = [];

    if (searchString) {
      active = projectsThatMatchSearch.filter((project) => !project.archived);
      archived = projectsThatMatchSearch.filter((project) => project.archived);
    } else {
      active = projects.filter((project) => !project.archived);
      archived = projects.filter((project) => project.archived);
    }

    return [active, archived];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, searchString]);

  if (onServer) {
    return null;
  }

  //The shared card is currently only visible when there are shared surveys, but there will be more shared activities in the future.
  const sharedSurveys = surveys.filter(
    (survey) =>
      survey.org_access === 'suborgs' && survey.organization.id != orgId
  );

  return (
    <LoadingBoundary
      futures={{
        activityOverviewFuture,
        projectsFuture,
        surveysFuture,
      }}
    >
      <>
        <Head>
          <title>{messages.layout.allProjects()}</title>
        </Head>
        <ActivitiesOverview orgId={orgId} />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 8,
          }}
        >
          <Typography variant="h4">
            <Msg id={messageIds.all.header} />
          </Typography>
          <TextField
            onChange={(evt) => {
              setSearchString(evt.target.value);
            }}
            placeholder={messages.all.projectFilterPlaceholder()}
            slotProps={{
              input: {
                endAdornment: searchString ? (
                  <IconButton onClick={() => setSearchString('')}>
                    <Close color="secondary" />
                  </IconButton>
                ) : undefined,
                startAdornment: (
                  <Search color="secondary" sx={{ marginRight: 1 }} />
                ),
              },
            }}
            value={searchString}
            variant="outlined"
          />
        </Box>
        <Box component="section" mt={4}>
          <Box
            component="header"
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 1,
            }}
          >
            <Typography mb={2} variant="h5">
              <Msg id={messageIds.activeProjects.header} />
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {sharedSurveys.length > 0 && (
              <Grid size={{ lg: 3, md: 4, xs: 12 }}>
                <SharedCard />
              </Grid>
            )}
            {activeProjects.map((project) => (
              <Grid key={project.id} size={{ lg: 3, md: 4, xs: 12 }}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </Box>
        {archivedProjects.length > 0 && (
          <Box component="section" sx={{ marginBottom: 16, marginTop: 4 }}>
            <Box
              component="header"
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: 1,
              }}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Typography variant="h5">
                  <Msg id={messageIds.archivedProjects.header} />
                </Typography>
                <ZUINumberChip
                  color={theme.palette.grey[200]}
                  size="sm"
                  value={archivedProjects.length}
                />
              </Box>
              <Button
                onClick={() => {
                  setShowArchived(!showArchived);
                }}
              >
                <Msg
                  id={
                    showArchived
                      ? messageIds.archivedProjects.hideShowButton.hide
                      : messageIds.archivedProjects.hideShowButton.show
                  }
                />
              </Button>
            </Box>
            {showArchived && (
              <Grid ref={archivedRef} container spacing={2}>
                {archivedProjects.map((project) => (
                  <Grid key={project.id} size={{ lg: 3, md: 4, xs: 12 }}>
                    <ProjectCard project={project} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </>
    </LoadingBoundary>
  );
};

AllProjectsSummaryPage.getLayout = function getLayout(page) {
  return <AllProjectsLayout>{page}</AllProjectsLayout>;
};

export default AllProjectsSummaryPage;
