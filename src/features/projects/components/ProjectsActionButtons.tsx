import React from 'react';
import { Box, Button } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useCreateProject from '../hooks/useCreateProject';
import { useNumericRouteParams } from 'core/hooks';

const ProjectActionButtons: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const createProject = useCreateProject(orgId);

  return (
    <Box display="flex">
      <Box mr={1}>
        <Button
          color="primary"
          onClick={() =>
            createProject({
              title: messages.form.createProject.newProject(),
            })
          }
          variant="contained"
        >
          <Msg id={messageIds.all.create} />
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectActionButtons;
