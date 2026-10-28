import React, { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useCreateProject from '../hooks/useCreateProject';
import { useNumericRouteParams } from 'core/hooks';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

const ProjectActionButtons: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const createProject = useCreateProject(orgId);

  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  return (
    <Box display="flex">
      <Box mr={1}>
        <Button
          color="primary"
          disabled={isLoading}
          endIcon={
            isLoading ? <CircularProgress color="inherit" size={16} /> : null
          }
          onClick={async () => {
            setIsLoading(true);
            try {
              await createProject({
                title: messages.form.createProject.newProject(),
              });
            } catch (error) {
              setIsLoading(false);
              showSnackbar('error', messages.form.createProject.error());
            }
          }}
          sx={
            isLoading
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
          <Msg
            id={isLoading ? messageIds.all.creating : messageIds.all.create}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectActionButtons;
