import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { FileCopy, UploadFileOutlined } from '@mui/icons-material';
import { useCallback, useState } from 'react';

import messageIds from '../../l10n/messagesIds';
import theme from 'theme';
import useImportedFile from '../../hooks/useImportedFile';
import { Msg, useMessages } from 'core/i18n';

const UploadFile = () => {
  const [error, setError] = useState<boolean>(false);
  const messages = useMessages(messageIds);
  const { parseData, loading } = useImportedFile();
  const [isSameData, setIsSameData] = useState<boolean>(false);

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
            <Typography>{messages.importDialog.loading()}</Typography>
          </Box>
        )}
        {!loading && (
          <>
            <IconButton
              style={{
                backgroundColor: '#1976D214',
                borderColor: '#1976D2',
                borderRadius: 100,
                height: 40,
                marginBottom: 12,
                padding: 30,
                width: 40,
              }}
            >
              <FileCopy sx={{ color: '#1976D2', fontSize: 40 }} />
            </IconButton>
            <Typography sx={{ fontWeight: 'bold' }}>
              {messages.importDialog.dataDetected()}
            </Typography>
            <Typography>{messages.importDialog.infoDetected()}</Typography>
          </>
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
                <Typography>{messages.importDialog.release()}</Typography>
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
                      {messages.importDialog.instructions()}
                    </Typography>
                    <Typography
                      sx={{
                        display: 'inline-block',
                      }}
                    >
                      {messages.importDialog.instructionsEnd()}
                    </Typography>
                  </Box>

                  <Box sx={{ gap: 10 }} />
                  {error ? (
                    <Typography sx={{ color: theme.palette.primary.main }}>
                      {messages.importDialog.unsupportedFile()}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: theme.palette.secondary.main }}>
                      {messages.importDialog.types()}
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
                setIsSameData(false);
                setError(false);
              }}
            >
              <Msg id={messageIds.importDialog.dialogButtons.restart} />
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
              <Msg id={messageIds.importDialog.dialogButtons.configure} />
            </Button>
          </Box>
        </Box>
      )}
      {isSameData && !loading && (
        <Box display="flex" justifyContent="flex-end" p={1} width={1}>
          <Box m={1}>
            <Button
              color="primary"
              onClick={(ev) => {
                ev.stopPropagation();
                setIsSameData(false);
              }}
            >
              <Msg id={messageIds.importDialog.dialogButtons.restart} />
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
              <Msg id={messageIds.importDialog.dialogButtons.configure} />
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UploadFile;
