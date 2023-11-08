import { UploadFileOutlined } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';

import messageIds from '../l10n/messageIds';
import theme from 'theme';
import useImportedFile from '../hooks/useImportedFile';
import { Msg, useMessages } from 'core/i18n';

const UploadFile = () => {
  const [error, setError] = useState<boolean>(false);
  const messages = useMessages(messageIds);
  const { parseData, loading } = useImportedFile();

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
      <Box
        {...getRootProps()}
        p={12}
        style={
          loading
            ? {
                alignItems: 'center',
                backgroundColor: '#1976D214',
                borderColor: '#1976D2',
                borderRadius: 4,
                borderStyle: 'dashed',
                borderWidth: 2,
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                margin: 16,
                textAlign: 'center',
              }
            : {
                alignItems: 'center',
                backgroundColor: error ? '#fdf7f7' : 'transparent',
                borderColor: error ? theme.palette.error.dark : '#E0E0E0',
                borderRadius: 4,
                borderStyle: error ? 'solid' : 'dashed',
                borderWidth: 2,
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                margin: 16,
                textAlign: 'center',
              }
        }
      >
        {loading && (
          <Box>
            <CircularProgress sx={{ color: '#1976D2' }} />
            <Typography>{messages.uploadDialog.loading()}</Typography>
          </Box>
        )}
        <input type="file" {...getInputProps()} />
        <Box>
          {!loading && (
            <Box>
              <IconButton
                onClick={open}
                style={{
                  backgroundColor: '#E0E0E0',
                  borderRadius: 100,
                  cursor: 'pointer',
                  height: 40,
                  padding: 30,
                  width: 40,
                }}
                type="button"
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
