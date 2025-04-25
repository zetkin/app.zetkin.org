import { Box, Button, useTheme } from '@mui/material';
import { FC } from 'react';
import {
  CheckCircleOutline,
  Close,
  InfoOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';

import ZUIText from '../ZUIText';
import { ZUIButtonProps } from '../ZUIButton';

type ZUIAlertProps = {
  buttonProps?: Pick<
    ZUIButtonProps,
    'label' | 'onClick' | 'endIcon' | 'startIcon' | 'href'
  >;
  description?: string;
  onClose?: () => void;
  severity: 'error' | 'info' | 'success' | 'warning';
  title: string;
};

const ZUIAlert: FC<ZUIAlertProps> = ({
  buttonProps,
  description,
  onClose,
  severity,
  title,
}) => {
  const theme = useTheme();

  const backgroundColors = {
    error: theme.palette.swatches.red[100],
    info: theme.palette.swatches.blue[100],
    success: theme.palette.swatches.green[100],
    warning: theme.palette.swatches.yellow[100],
  } as const;

  const colors = {
    error: theme.palette.swatches.red[900],
    info: theme.palette.swatches.blue[900],
    success: theme.palette.swatches.green[900],
    warning: theme.palette.swatches.yellow[900],
  } as const;

  const Icon = () => {
    if (severity == 'error') {
      return (
        <InfoOutlined
          sx={(theme) => ({
            color: theme.palette.error.main,
            fontSize: '1.25rem',
          })}
        />
      );
    } else if (severity == 'info') {
      return (
        <InfoOutlined
          sx={(theme) => ({
            color: theme.palette.info.main,
            fontSize: '1.25rem',
          })}
        />
      );
    } else if (severity == 'success') {
      return (
        <CheckCircleOutline
          sx={(theme) => ({
            color: theme.palette.success.main,
            fontSize: '1.25rem',
          })}
        />
      );
    } else {
      //Severity must be "warning"
      return (
        <WarningAmberOutlined
          sx={(theme) => ({
            color: theme.palette.warning.dark,
            fontSize: '1.25rem',
          })}
        />
      );
    }
  };

  return (
    <Box
      sx={() => ({
        backgroundColor: backgroundColors[severity],
        borderRadius: '0.25rem',
        color: colors[severity],
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
      })}
    >
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '0.75rem',
            paddingTop: onClose ? '0.25rem' : '',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              paddingTop: '0.1rem',
            }}
          >
            <Icon />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <ZUIText color="inherit" variant="bodyMdSemiBold">
              {title}
            </ZUIText>
            {description && (
              <ZUIText color="inherit" variant="bodySmSemiBold">
                {description}
              </ZUIText>
            )}
          </Box>
        </Box>
        {onClose && (
          <Button
            color="inherit"
            sx={{ boxShadow: 'none', minWidth: 0, padding: '0.313rem' }}
          >
            <Close sx={{ fontSize: '1.25rem' }} />
          </Button>
        )}
      </Box>
      {buttonProps && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            color="inherit"
            sx={(theme) => ({
              boxShadow: 'none',
              minWidth: 'max-content',
              padding: '0.33rem 0.625rem',
              ...theme.typography.labelSmSemiBold,
            })}
            variant="outlined"
          >
            {buttonProps.label}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ZUIAlert;
