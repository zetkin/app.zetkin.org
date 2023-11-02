import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';

import { ImportedFile } from '../utils/parseFile';
import messageIds from '../l10n/messagesIds';
import theme from 'theme';
import { UploadFileOutlined } from '@mui/icons-material';
import useImportedFile from '../hooks/useImportedFile';
import { Msg, useMessages } from 'core/i18n';

const UploadFile = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [rawData, setRawData] = useState<ImportedFile>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const messages = useMessages(messageIds);
  const { importData } = useImportedFile();

  const onDrop = useCallback((acceptedFiles: File[]): void => {
    acceptedFiles.map((file: File) => {
      setLoading(true);
      setUploadedFile(file);

      importData(file)?.then((res) => {
        setRawData(res);
        setLoading(false);
      });
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
        {...getRootProps({ className: 'dropzone' })}
        p={12}
        style={{
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
        }}
      >
        {loading && !rawData && (
          <Box>
            <CircularProgress />
            <Typography>{messages.importDialog.loading()}</Typography>
          </Box>
        )}
        <input className="input-zone" type="file" {...getInputProps()} />
        <Box className="text-center">
          {!uploadedFile && !loading && (
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
                <Typography className="dropzone-content">
                  {messages.importDialog.release()}
                </Typography>
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
          {/* TODO: To be removed when mapping dialog is ready */}
          {!loading && rawData && (
            <Button variant="contained">{'Ready to import!'}</Button>
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
