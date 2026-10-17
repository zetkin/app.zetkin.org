import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useCreateProject from '../hooks/useCreateProject';
import { useNumericRouteParams } from 'core/hooks';
import ZUITextField from 'zui/components/ZUITextField';

const ProjectActionButtons: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const createProject = useCreateProject(orgId);
  const [showModal, setShowModal] = useState(false);

  function handleClose() {
    setShowModal(false);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let title = messages.form.createProject.newProject();
    if (formData.has('projectName')) {
      title = formData.get('projectName')!.toString();
    }
    createProject({
      title,
    });
    handleClose();
  };

  return (
    <>
      <Box display="flex">
        <Box mr={1}>
          <Button
            color="primary"
            onClick={() => setShowModal(true)}
            variant="contained"
          >
            <Msg id={messageIds.all.create} />
          </Button>
        </Box>
      </Box>
      <Dialog onClose={handleClose} open={showModal}>
        <DialogContent>
          <Box sx={{ paddingTop: 1 }}>
            <form id="name-form" onSubmit={handleSubmit}>
              <ZUITextField
                fullWidth
                id="name"
                inputRef={(ref) => ref?.focus()}
                label={messages.form.name()}
                name="projectName"
                required
                type="text"
              />
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <Msg id={messageIds.form.deleteProject.cancel} />
          </Button>
          <Button form="name-form" type="submit">
            <Msg id={messageIds.createButton.create} />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectActionButtons;
