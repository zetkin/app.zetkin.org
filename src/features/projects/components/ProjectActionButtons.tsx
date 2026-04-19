import { Box } from '@mui/material';
import { Link } from '@mui/material';
import {
  AssignmentOutlined,
  Archive,
  CheckBoxOutlined,
  Delete,
  EmailOutlined,
  Event,
  HeadsetMic,
  Map,
  OpenInNew,
  Settings,
  Unarchive,
} from '@mui/icons-material';
import React, { useContext, useState } from 'react';

import ProjectDetailsForm from 'features/projects/components/ProjectDetailsForm';
import { DialogContent as CreateTaskDialogContent } from 'zui/ZUISpeedDial/actions/createTask';
import projectMessageIds from '../l10n/messageIds';
import useProject from '../hooks/useProject';
import useCreateProjectActivity from '../hooks/useCreateProjectActivity';
import useCreateEmail from 'features/emails/hooks/useCreateEmail';
import useCreateEvent from 'features/events/hooks/useCreateEvent';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinProject } from 'utils/types/zetkin';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { Msg, useMessages } from 'core/i18n';
import useCreateAreaAssignment from 'features/areaAssignments/hooks/useCreateAreaAssignment';
import useFeature from 'utils/featureFlags/useFeature';
import { AREAS, TASKS } from 'utils/featureFlags';
import areaAssignmentMessageIds from 'features/areaAssignments/l10n/messageIds';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';

enum PROJECT_MENU_ITEMS {
  ARCHIVE_PROJECT = 'archiveProject',
  EDIT_PROJECT = 'editProject',
  DELETE_PROJECT = 'deleteProject',
  SHOW_PUBLIC_PAGE = 'showPublicPage',
}

interface ProjectActionButtonsProps {
  project: ZetkinProject;
}

const ProjectActionButtons: React.FunctionComponent<
  ProjectActionButtonsProps
> = ({ project }) => {
  const campaginMessages = useMessages(projectMessageIds);
  const areaAssignmentMessages = useMessages(areaAssignmentMessageIds);
  const { orgId, projectId } = useNumericRouteParams();
  const hasAreaAssignments = useFeature(AREAS);
  const hasTasks = useFeature(TASKS);

  // Dialogs
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);

  const createAreaAssignment = useCreateAreaAssignment(orgId, projectId);
  const createEvent = useCreateEvent(orgId);
  const { createCallAssignment, createSurvey } = useCreateProjectActivity(
    orgId,
    projectId
  );
  const { deleteProject, updateProject } = useProject(orgId, project.id);
  const { createEmail } = useCreateEmail(orgId);
  const themes = useEmailThemes(orgId).data || [];
  const configs = useEmailConfigs(orgId).data || [];

  const handleCreateEvent = () => {
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() + 1);
    defaultStart.setMinutes(0);
    defaultStart.setSeconds(0);
    defaultStart.setMilliseconds(0);

    const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);

    createEvent({
      activity_id: null,
      campaign_id: project.id,
      end_time: defaultEnd.toISOString(),
      location_id: null,
      start_time: defaultStart.toISOString(),
      title: null,
    });
  };

  const handleArchiveProject = () => {
    updateProject({ archived: !project.archived });
  };

  const menuItems = [
    {
      icon: <Event />,
      label: campaginMessages.createButton.createEvent(),
      onClick: handleCreateEvent,
    },
    {
      icon: <HeadsetMic />,
      label: campaginMessages.createButton.createCallAssignment(),
      onClick: () =>
        createCallAssignment({
          title: campaginMessages.form.createCallAssignment.newCallAssignment(),
        }),
    },
    {
      icon: <AssignmentOutlined />,
      label: campaginMessages.createButton.createSurvey(),
      onClick: () =>
        createSurvey({
          signature: 'require_signature',
          title: campaginMessages.form.createSurvey.newSurvey(),
        }),
    },
  ];

  if (hasTasks) {
    menuItems.push({
      icon: <CheckBoxOutlined />,
      label: campaginMessages.createButton.createTask(),
      onClick: () => setCreateTaskDialogOpen(true),
    });
  }

  if (hasAreaAssignments) {
    menuItems.push({
      icon: <Map />,
      label: campaginMessages.createButton.createAreaAssignment(),
      onClick: () =>
        createAreaAssignment({
          instructions: '',
          /*
          metrics: [
            {
              definesDone: true,
              description: '',
              kind: 'boolean',
              question:
                campaginMessages.form.createAreaAssignment.defaultQuestion(),
            },
          ],
          */
          reporting_level: 'location',
          title: areaAssignmentMessages.default.title(),
        }),
    });
  }

  if (configs.length && themes.length > 0) {
    menuItems.push({
      icon: <EmailOutlined />,
      label: campaginMessages.createButton.createEmail(),
      onClick: () =>
        createEmail({
          campaign_id: projectId,
          config_id: configs[0].id,
          theme_id: themes[0].id,
          title: campaginMessages.form.createEmail.newEmail(),
        }),
    });
  }

  return (
    <Box display="flex" gap={1}>
      <Box>
        <ZUIButtonMenu
          items={menuItems}
          label={campaginMessages.createButton.createActivity()}
        />
      </Box>
      <Box>
        <ZUIEllipsisMenu
          items={[
            {
              id: PROJECT_MENU_ITEMS.EDIT_PROJECT,
              label: (
                <>
                  <Settings />
                  <Msg id={projectMessageIds.form.edit} />
                </>
              ),
              onSelect: () => setEditProjectDialogOpen(true),
            },
            {
              id: PROJECT_MENU_ITEMS.ARCHIVE_PROJECT,
              label: project.archived ? (
                <>
                  <Unarchive />
                  <Msg id={projectMessageIds.form.archiveProject.unarchive} />
                </>
              ) : (
                <>
                  <Archive />
                  <Msg id={projectMessageIds.form.archiveProject.archive} />
                </>
              ),
              onSelect: handleArchiveProject,
            },
            {
              id: PROJECT_MENU_ITEMS.DELETE_PROJECT,
              label: (
                <>
                  <Delete />
                  <Msg id={projectMessageIds.form.deleteProject.title} />
                </>
              ),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: deleteProject,
                  title: campaginMessages.form.deleteProject.title(),
                  warningText: campaginMessages.form.deleteProject.warning(),
                });
              },
            },
            {
              id: PROJECT_MENU_ITEMS.SHOW_PUBLIC_PAGE,
              label: (
                <>
                  <OpenInNew />
                  <Link
                    color="inherit"
                    display="flex"
                    href={`/o/${orgId}/projects/${projectId}`}
                    sx={{ alignItems: 'center', gap: 1 }}
                    target="_blank"
                    underline="none"
                  >
                    {
                      <Msg
                        id={projectMessageIds.singleProject.showPublicPage}
                      />
                    }
                  </Link>
                </>
              ),
              onSelect: () => {
                // Do nothing, but without this, the menu will not close
              },
            },
          ]}
        />
      </Box>
      <ZUIDialog
        onClose={() => setEditProjectDialogOpen(false)}
        open={editProjectDialogOpen}
        title={campaginMessages.form.edit()}
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
      <ZUIDialog
        onClose={() => {
          setCreateTaskDialogOpen(false);
        }}
        open={createTaskDialogOpen}
        title={campaginMessages.form.createTask.title()}
      >
        <CreateTaskDialogContent
          closeDialog={() => {
            setCreateTaskDialogOpen(false);
          }}
        />
      </ZUIDialog>
    </Box>
  );
};

export default ProjectActionButtons;
