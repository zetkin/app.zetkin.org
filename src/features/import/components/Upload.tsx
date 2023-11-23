import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { UploadFileOutlined } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  CircularProgress,
  IconButton,
  Link,
  Typography,
  useTheme,
} from '@mui/material';
import { CSSProperties, FC, useCallback, useState } from 'react';

import ImportFooter from './ImportFooter';
import messageIds from '../l10n/messageIds';
import useImportedFile from '../hooks/useImportedFile';
import { useMessages } from 'core/i18n';

const sharedProperties: CSSProperties = {
  alignItems: 'center',
  borderRadius: 4,
  borderWidth: 2,
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  margin: 16,
  minWidth: 600,
  padding: 50,
  textAlign: 'center',
  transition: 'height 1s',
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

interface UploadProps {
  onSuccess: () => void;
}

const Upload: FC<UploadProps> = ({ onSuccess }) => {
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
    acceptedFiles.map(async (file: File) => {
      const uploadStatus = await parseData(file);
      if (uploadStatus == 'success') {
        onSuccess();
      }
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
        {!loading && (
          <>
            <IconButton
              onClick={open}
              sx={{
                backgroundColor: theme.palette.grey[300],
                borderRadius: 100,
                cursor: 'pointer',
                height: '40px',
                padding: '30px',
                width: '40px',
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
                <Typography component="span" sx={{ paddingTop: 2 }}>
                  {messages.uploadDialog.instructions({
                    link: (
                      <Link
                        onClick={open}
                        sx={{
                          color: theme.palette.primary.main,
                          cursor: 'pointer',
                          textDecorationLine: 'underline',
                        }}
                      >
                        {messages.uploadDialog.selectClick()}
                      </Link>
                    ),
                  })}
                </Typography>
                <Typography
                  sx={{
                    color: error
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                    paddingTop: 1,
                  }}
                >
                  {error
                    ? messages.uploadDialog.unsupportedFile()
                    : messages.uploadDialog.types()}
                </Typography>
              </>
            )}
          </>
        )}
      </Box>
      {error && !loading && (
        <ImportFooter
          onClickSecondary={() => setError(false)}
          primaryButtonDisabled={true}
          primaryButtonMsg={messages.actionButtons.configure()}
          secondaryButtonMsg={messages.actionButtons.restart()}
        />
      )}
    </>
  );
};

export default Upload;
