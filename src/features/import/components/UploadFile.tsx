import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { UploadFileOutlined } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { CSSProperties, useCallback, useState } from 'react';

import messageIds from '../l10n/messageIds';
import useImportedFile from '../hooks/useImportedFile';
import { Msg, useMessages } from 'core/i18n';

const sharedProperties: CSSProperties = {
  alignItems: 'center',
  borderRadius: 4,
  borderWidth: 2,
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  margin: 16,
  padding: 50,
  textAlign: 'center',
};

const useStyles = makeStyles((theme) => ({
  errorState: {
    backgroundColor: alpha(
      theme.palette.statusColors.red,
      theme.palette.action.selectedOpacity
    ),
    borderColor: theme.palette.error.dark,
    borderStyle: 'solid',
    ...sharedProperties,
  },
  initialState: {
    backgroundColor: 'transparent',
    borderColor: theme.palette.grey[300],
    borderStyle: 'dashed',
    ...sharedProperties,
  },
  loadingState: {
    backgroundColor: alpha(
      theme.palette.statusColors.blue,
      theme.palette.action.selectedOpacity
    ),
    borderColor: theme.palette.statusColors.blue,
    borderStyle: 'dashed',
    ...sharedProperties,
  },
  sharedProperties: {
    ...sharedProperties,
  },
}));

const UploadFile = () => {
  const [error, setError] = useState<boolean>(false);
  const messages = useMessages(messageIds);
  const { parseData, loading } = useImportedFile();
  const theme = useTheme();
  const classes = useStyles(theme);

  let boxClass = classes.initialState;
  if (error) {
    boxClass = classes.errorState;
  } else if (loading) {
    boxClass = classes.loadingState;
  }

  const onDrop = useCallback((acceptedFiles: File[]): void => {
    acceptedFiles.map((file: File) => {
      parseData(file);
    });
  }, []);

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    accept: {
      types: ['.csv', '.xls', '.xlsx'],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDrop,
    onDropAccepted: () => setError(false),
    onDropRejected: () => setError(true),
    onError: () => {
      setError(true);
    },
  });

  return (
    <>
      <Box {...getRootProps()} className={boxClass}>
        {loading && (
          <Box>
            <CircularProgress sx={{ color: theme.palette.statusColors.blue }} />
            <Typography sx={{ color: theme.palette.text.primary }}>
              {messages.uploadDialog.loading()}
            </Typography>
          </Box>
        )}
        <input type="file" {...getInputProps()} />
        <Box>
          {!loading && (
            <Box>
              <IconButton
                onClick={open}
                sx={{
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: 100,
                  cursor: 'pointer',
                  height: 40,
                  padding: 30,
                  width: 40,
                }}
              >
                <UploadFileOutlined
                  sx={{ color: theme.palette.primary.main, fontSize: 40 }}
                />
              </IconButton>
              {isDragActive ? (
                <Typography>{messages.uploadDialog.release()}</Typography>
              ) : (
                <>
                  <Box pt={2}>
                    <Typography
                      onClick={open}
                      sx={{
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                        display: 'inline-block',
                        padding: 1,
                        textDecorationLine: 'underline',
                      }}
                    >
                      {messages.uploadDialog.instructions()}
                    </Typography>
                    <Typography
                      sx={{
                        display: 'inline-block',
                      }}
                    >
                      {messages.uploadDialog.instructionsEnd()}
                    </Typography>
                  </Box>

                  <Box sx={{ gap: 10 }} />
                  {error ? (
                    <Typography sx={{ color: theme.palette.primary.main }}>
                      {messages.uploadDialog.unsupportedFile()}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: theme.palette.secondary.main }}>
                      {messages.uploadDialog.types()}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {error && !loading && (
        <Box display="flex" justifyContent="flex-end" p={1} width={1}>
          <Box m={1}>
            <Button
              color="primary"
              onClick={(ev) => {
                ev.stopPropagation();
                setError(false);
              }}
            >
              <Msg id={messageIds.uploadDialog.dialogButtons.restart} />
            </Button>
          </Box>
          <Box m={1}>
            <Button
              color="primary"
              disabled={error}
              onClick={(ev) => ev.stopPropagation()}
              type="submit"
              variant="contained"
            >
              <Msg id={messageIds.uploadDialog.dialogButtons.configure} />
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UploadFile;
