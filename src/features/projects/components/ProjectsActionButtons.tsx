import React from 'react';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useCreateProject from '../hooks/useCreateProject';
import { useNumericRouteParams } from 'core/hooks';

const ProjectActionButtons: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const createProject = useCreateProject(orgId);

  const [isBusy, setIsBusy] = useState(false);

  return (
    <Box display="flex">
      <Box mr={1}>
        <Button
          color="primary"
          disabled={isBusy}
          endIcon={
            isBusy ? <CircularProgress color="inherit" size={16} /> : null
          }
          onClick={async () => {
            setIsBusy(true);
            try {
              await createProject({
                title: messages.form.createProject.newProject(),
              });
            } catch (error) {
              setIsBusy(false);
              throw error;
            }
          }}
          sx={
            isBusy
              ? (theme) => ({
                  '&.Mui-disabled': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                })
              : undefined
          }
          variant="contained"
        >
          <Msg id={isBusy ? messageIds.all.creating : messageIds.all.create} />
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectActionButtons;
