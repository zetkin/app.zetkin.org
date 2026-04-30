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
  SplitscreenOutlined,
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
import EventShiftModal from 'features/calendar/components/EventShiftModal';

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
  const projectMessages = useMessages(projectMessageIds);
  const areaAssignmentMessages = useMessages(areaAssignmentMessageIds);
  const { orgId, projectId } = useNumericRouteParams();
  const hasAreaAssignments = useFeature(AREAS);
  const hasTasks = useFeature(TASKS);

  // Dialogs
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [shiftModalDates, setShiftModalDates] = useState<[Date, Date] | null>(
    null
  );

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

  const getDefaultEventDates = (): [Date, Date] => {
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() + 1);
    defaultStart.setMinutes(0);
    defaultStart.setSeconds(0);
    defaultStart.setMilliseconds(0);

    const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);
    return [defaultStart, defaultEnd];
  };

  const handleCreateEvent = () => {
    const [defaultStart, defaultEnd] = getDefaultEventDates();
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
      label: projectMessages.createButton.createEvent(),
      onClick: handleCreateEvent,
    },
    {
      icon: <SplitscreenOutlined />,
      label: projectMessages.createButton.createMultiShiftEvent(),
      onClick: () => {
        setShiftModalDates(getDefaultEventDates());
      },
    },
    {
      icon: <HeadsetMic />,
      label: projectMessages.createButton.createCallAssignment(),
      onClick: () =>
        createCallAssignment({
          title: projectMessages.form.createCallAssignment.newCallAssignment(),
        }),
    },
    {
      icon: <AssignmentOutlined />,
      label: projectMessages.createButton.createSurvey(),
      onClick: () =>
        createSurvey({
          signature: 'require_signature',
          title: projectMessages.form.createSurvey.newSurvey(),
        }),
    },
  ];

  if (hasTasks) {
    menuItems.push({
      icon: <CheckBoxOutlined />,
      label: projectMessages.createButton.createTask(),
      onClick: () => setCreateTaskDialogOpen(true),
    });
  }

  if (hasAreaAssignments) {
    menuItems.push({
      icon: <Map />,
      label: projectMessages.createButton.createAreaAssignment(),
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
      label: projectMessages.createButton.createEmail(),
      onClick: () =>
        createEmail({
          campaign_id: projectId,
          config_id: configs[0].id,
          theme_id: themes[0].id,
          title: projectMessages.form.createEmail.newEmail(),
        }),
    });
  }

  let eventShiftModalDates = getDefaultEventDates();
  let eventShiftModalState = 'closed';

  if (shiftModalDates) {
    eventShiftModalDates = shiftModalDates;
    eventShiftModalState = shiftModalDates
      .map((date: Date) => date.toISOString())
      .join('-');
  }

  return (
    <Box display="flex" gap={1}>
      <Box>
        <ZUIButtonMenu
          items={menuItems}
          label={projectMessages.createButton.createActivity()}
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
                  title: projectMessages.form.deleteProject.title(),
                  warningText: projectMessages.form.deleteProject.warning(),
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
        title={projectMessages.form.edit()}
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
        title={projectMessages.form.createTask.title()}
      >
        <CreateTaskDialogContent
          closeDialog={() => {
            setCreateTaskDialogOpen(false);
          }}
        />
      </ZUIDialog>
      <EventShiftModal
        key={eventShiftModalState}
        close={() => {
          setShiftModalDates(null);
        }}
        dates={eventShiftModalDates}
        open={!!shiftModalDates}
      />
    </Box>
  );
};

export default ProjectActionButtons;
