import { Box, Button, Fade, useTheme } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import {
  CheckCircleOutline,
  Close,
  InfoOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';

import ZUIText from '../ZUIText';
import { ZUIButtonProps } from '../ZUIButton';

type ZUIAlertProps = {
  /**
   * Controls if the alert will animate when it appears.
   * Set this to true if the alert you are making might appear
   * on the page after it has already rendered.
   *
   * Defaults to false.
   */
  appear?: boolean;

  /**
   * Props to render an action button at the bottom of the alert.
   */
  button?: Pick<
    ZUIButtonProps,
    'label' | 'onClick' | 'endIcon' | 'startIcon' | 'href'
  >;

  /**
   * The description/content of the alert.
   */
  description?: string;

  /**
   * If this function is provided there will be an "X"-button
   * to close the alert in the top right corner.
   *
   * This function will run when the user presses that button.
   */
  onClose?: () => void;

  /**
   * If you provide an onClose-function, also provide this property.
   * Controls if the alert is visible or not.
   *
   * Defaults to "true".
   */
  open?: boolean;

  /**
   * The type of alert to show.
   */
  severity: 'error' | 'info' | 'success' | 'warning';

  /**
   * The title of the alert.
   */
  title: string;
};

const ZUIAlert: FC<ZUIAlertProps> = ({
  appear = false,
  button,
  description,
  onClose,
  open = true,
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

  const [animatedOut, setAnimatedOut] = useState(false);

  const timeout = 1000;

  useEffect(() => {
    if (open) {
      setAnimatedOut(false);
    } else {
      const timer = setTimeout(() => {
        setAnimatedOut(true);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (animatedOut) {
    return null;
  }

  return (
    <Fade appear={appear} in={open} timeout={timeout}>
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
              onClick={onClose}
              sx={{
                boxShadow: 'none',
                flexShrink: 0,
                minWidth: 0,
                padding: '0.313rem',
              }}
            >
              <Close sx={{ fontSize: '1.25rem' }} />
            </Button>
          )}
        </Box>
        {button && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '0.5rem',
            }}
          >
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
              {button.label}
            </Button>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default ZUIAlert;
