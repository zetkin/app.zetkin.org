import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Grid, Link, Typography } from '@mui/material';
import React, { Suspense, useCallback, useState } from 'react';

import ActivitiesOverview from 'features/projects/components/ActivitiesOverview';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleProjectLayout from 'features/projects/layout/SingleProjectLayout';
import useProject from 'features/projects/hooks/useProject';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinProject } from 'utils/types/zetkin';
import ProjectURLCard from 'features/projects/components/ProjectURLCard';
import ZUIFuture from 'zui/ZUIFuture';
import { useMessages } from 'core/i18n';
import messageIds from 'features/projects/l10n/messageIds';
import ZUIDialog from 'zui/ZUIDialog';
import ProjectDetailsForm from 'features/projects/components/ProjectDetailsForm';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeProjects'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, projectId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);

  try {
    await apiClient.get<ZetkinProject>(
      `/api/orgs/${orgId}/campaigns/${projectId}`
    );
    return {
      props: {},
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const ProjectSummaryPage: PageWithLayout = () => {
  const isOnServer = useServerSide();
  const { orgId, projectId } = useNumericRouteParams();
  const { projectFuture: projectFuture, updateProject: updateProject } =
    useProject(orgId, projectId);
  const messages = useMessages(messageIds);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);

  const openEditProject = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setEditProjectDialogOpen(true);
    },
    [setEditProjectDialogOpen]
  );

  if (isOnServer) {
    return null;
  }

  return (
    <ZUIFuture future={projectFuture}>
      {(project) => {
        return (
          <>
            <Head>
              <title>{project.title}</title>
            </Head>
            <Grid container spacing={2}>
              <Grid size={{ lg: 8, md: 6 }}>
                <Box mb={project.info_text || project.manager ? 2 : 0}>
                  <Grid container spacing={2}>
                    <Grid size={{ lg: 12, md: 12, xs: 12 }}>
                      {project.info_text ? (
                        <Typography variant="body1">
                          {project.info_text}
                        </Typography>
                      ) : (
                        <Typography
                          sx={(theme) => ({
                            color: theme.palette.text.secondary,
                          })}
                          variant="body1"
                        >
                          {messages.activitiesOverview.noDescription.text({
                            addOneNow: (
                              <Link
                                onClick={openEditProject}
                                sx={{
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                  cursor: 'pointer',
                                  textDecoration: 'none',
                                }}
                              >
                                {messages.activitiesOverview.noDescription.addOneNow()}
                              </Link>
                            ),
                          })}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid size={{ lg: 4, md: 6 }}>
                <ProjectURLCard
                  isOpen={!!project.published}
                  orgId={orgId}
                  projectId={projectId}
                />
              </Grid>
            </Grid>

            <Suspense>
              <ActivitiesOverview orgId={orgId} projectId={projectId} />
            </Suspense>

            <ZUIDialog
              onClose={() => setEditProjectDialogOpen(false)}
              open={editProjectDialogOpen}
              title={messages.form.edit()}
            >
              <ProjectDetailsForm
                onCancel={() => setEditProjectDialogOpen(false)}
                onSubmit={(data) => {
                  updateProject({ ...data });
                  setEditProjectDialogOpen(false);
                }}
                project={project}
              />
            </ZUIDialog>
          </>
        );
      }}
    </ZUIFuture>
  );
};

ProjectSummaryPage.getLayout = function getLayout(page) {
  return <SingleProjectLayout>{page}</SingleProjectLayout>;
};

export default ProjectSummaryPage;
