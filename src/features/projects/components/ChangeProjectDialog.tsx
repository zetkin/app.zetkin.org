import { Architecture, Close, Search } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';

import oldTheme from 'theme';
import { useMessages } from 'core/i18n';
import useProjects from 'features/projects/hooks/useProjects';
import { useNumericRouteParams } from '../../../core/hooks';
import messageIds from '../l10n/messageIds';

type ChangeProjectDialogProps = {
  errorMessage: string;
  onClose: () => void;
  onProjectSelected: (projectId: number) => Promise<void>;
  open: boolean;
  title: string;
};

/**
 * `ChangeProjectDialog` is a React functional component that renders a dialog
 * for selecting and switching to a different project. It provides a search
 * functionality to filter projects and allows the user to select a project
 * from the filtered list.
 *
 * ## Props:
 * - `errorMessage` (string): Message to be displayed when an error occurs.
 * - `onProjectSelected` (function): Callback function triggered when a new project is selected.
 *    It receives the selected project ID as an argument and returns a Promise.
 * - `onClose` (function): Callback function to close the dialog.
 * - `open` (boolean): Controls whether the dialog is open or closed.
 * - `title` string containing the title of this component
 *
 * ## Usage:
 * ```tsx
 * <ChangeProjectDialog
 *  errorMessage={messages.callAssignmentChangeProjectDialog.error()}
 *  onProjectSelected={handleOnProjectSelected}
 *  onClose={() => setIsMoveDialogOpen(false)}
 *  open={isMoveDialogOpen}
 *  title={messages.callAssignmentChangeProjectDialog.dialogTitle()}
 * />
 * ```
 */
const ChangeProjectDialog: React.FunctionComponent<
  ChangeProjectDialogProps
> = ({ title, errorMessage, open, onProjectSelected, onClose }) => {
  const { orgId, projectId } = useNumericRouteParams();

  const [error, setError] = useState(false);
  const messages = useMessages(messageIds);

  const fullScreen = useMediaQuery(oldTheme.breakpoints.down('md'));

  const [projectFilter, setProjectFilter] = useState('');
  const [isLoadingProject, setIsLoadingProject] = useState(0);

  const { data: projects } = useProjects(orgId);
  projects?.reverse();

  const filteredProjects = projects
    ?.filter((project) => project.title.toLowerCase().includes(projectFilter))
    .filter((project) => project.id != projectId);

  const onSearchChange = (value: string) => {
    setProjectFilter(value);
  };

  const handleMove = async (projectId: number) => {
    setIsLoadingProject(projectId);

    try {
      await onProjectSelected(projectId);
      handleClose();
    } catch (error) {
      setIsLoadingProject(0);
      setError(true);
    }
  };

  const handleClose = () => {
    setIsLoadingProject(0);
    setProjectFilter('');
    onClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={() => {
        onClose();
      }}
      open={open}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '85vh',
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <DialogTitle sx={{ paddingLeft: 2 }} variant="h5">
            {title}
          </DialogTitle>

          <IconButton onClick={handleClose}>
            <Close
              color="secondary"
              sx={{
                cursor: 'pointer',
              }}
            />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="column" rowGap={1}>
          <TextField
            fullWidth
            id="ChangeProjectDialog-inputField"
            InputProps={{
              startAdornment: <Search color="secondary" />,
            }}
            onChange={(ev) => onSearchChange(ev.target.value)}
            value={projectFilter}
            variant="outlined"
          />

          {error && <Alert severity="error">{errorMessage}</Alert>}

          <Box
            sx={{
              overflowY: 'scroll',
            }}
          >
            <List>
              {filteredProjects?.map((project) => {
                return (
                  <ListItem
                    key={`ChangeProjectDialog-projectItem-${project.id}`}
                  >
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box alignItems="center" display="flex" marginRight={2}>
                        <Box marginRight={2}>
                          <Architecture color="secondary" />
                        </Box>
                        {project.title}
                      </Box>
                      <Box alignItems="center" display="flex">
                        {!isLoadingProject && (
                          <Button
                            onClick={() => handleMove(project.id)}
                            variant="outlined"
                          >
                            {messages.changeProjectDialog.moveButtonLabel()}
                          </Button>
                        )}
                        {isLoadingProject === project.id && (
                          <CircularProgress color="secondary" size={30} />
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default ChangeProjectDialog;
