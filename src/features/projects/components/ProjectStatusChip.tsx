import { Box } from '@mui/material';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import { ZetkinProject } from 'utils/types/zetkin';
import oldTheme from 'theme';
import messageIds from '../l10n/messageIds';

enum ProjectStatus {
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  PRIVATE = 'private',
  PUBLIC = 'public',
}

const getProjectStatus = (project: ZetkinProject): ProjectStatus => {
  if (project.archived) {
    return ProjectStatus.ARCHIVED;
  }

  if (!project.published) {
    return ProjectStatus.DRAFT;
  }

  if (project.visibility == 'open') {
    return ProjectStatus.PUBLIC;
  }

  return ProjectStatus.PRIVATE;
};

const ProjectStatusChip: FC<{ project: ZetkinProject }> = ({
  project: project,
}) => {
  const colors: Record<ProjectStatus, string> = {
    archived: oldTheme.palette.grey[500],
    draft: oldTheme.palette.grey[500],
    private: oldTheme.palette.statusColors.blue,
    public: oldTheme.palette.success.main,
  };

  const status = getProjectStatus(project);

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: colors[status],
        borderRadius: '2em',
        color: 'white',
        display: 'inline-flex',
        fontSize: 14,
        fontWeight: 'bold',
        padding: '0.5em 0.7em',
      }}
    >
      <Msg id={messageIds.singleProject.status[status]} />
    </Box>
  );
};

export default ProjectStatusChip;
