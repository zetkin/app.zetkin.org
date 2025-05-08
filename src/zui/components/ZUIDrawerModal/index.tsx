import { ChevronRight } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import { MUIIcon } from '../types';
import AvatarBackground from '../ZUIPersonAvatar/AvatarBackground';
import ZUIButton from '../ZUIButton';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import Drawer from './Drawer';

type Props = {
  /**
   * The content of the modal.
   */
  children: ReactNode;

  /**
   * The name of the feature.
   * Used to generate the background of the avatar.
   */
  featureName?: string;

  /**
   * The icon to display in the avatar.
   *
   * Pass in reference to the icon, for example: Close, not < Close / >.
   */
  icon?: MUIIcon;

  /**
   * Function that runs when closing the modal.
   */
  onClose: () => void;

  /**
   * Determines whether the modal is open.
   */
  open: boolean;

  /**
   * The primary action button in the modal header.
   */
  primaryButton?: {
    label: string;
    onClick: () => void;
  };

  /**
   * The subtitle of the modal.
   *
   * If a string array is passed in they will render as breadcrumbs.
   */
  subtitle?: string | string[];

  /**
   * The title of the modal.
   */
  title?: string;
};

const ZUIDrawerModal: FC<Props> = ({
  children,
  featureName,
  icon: Icon,
  onClose,
  open,
  primaryButton,
  subtitle,
  title,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Drawer onClose={onClose} open={open}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25',
        }}
      >
        <Box
          sx={(theme) => ({
            alignItems: 'flex-start',
            borderBottom: `0.063rem solid ${theme.palette.dividers.lighter}`,
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '1.25rem',
          })}
        >
          <Box sx={{ display: 'flex', gap: '1.25rem' }}>
            <Box
              sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {featureName && (
                <AvatarBackground
                  seed={featureName}
                  size={42}
                  variant="circular"
                />
              )}
              {Icon && (
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '2.625rem',
                    justifyContent: 'center',
                    position: 'absolute',
                    width: '2.625rem',
                  }}
                >
                  <Icon sx={{ color: 'white', fontSize: '1.75rem' }} />
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {title && <Typography variant="headingMd">{title}</Typography>}
              {subtitle && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: '0.25rem',
                  }}
                >
                  {!Array.isArray(subtitle) && (
                    <Typography color="secondary" variant="headingSm">
                      {subtitle}
                    </Typography>
                  )}
                  {Array.isArray(subtitle) &&
                    subtitle.map((crumb, index) => (
                      <Box
                        key={crumb}
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          gap: '0.25rem',
                        }}
                      >
                        <Typography color="secondary" variant="headingSm">
                          {crumb.charAt(0).toUpperCase() +
                            crumb.toLowerCase().slice(1)}
                        </Typography>
                        {index != subtitle.length - 1 && (
                          <ChevronRight
                            color="secondary"
                            sx={{ fontSize: '1.25rem' }}
                          />
                        )}
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <ZUIButton
              label={messages.drawerModal.close()}
              onClick={onClose}
              onKeyDown={(ev) => {
                if (ev.key == 'Enter') {
                  onClose();
                }
              }}
              variant="secondary"
            />
            {primaryButton && (
              <ZUIButton
                label={primaryButton.label}
                onClick={primaryButton.onClick}
                onKeyDown={primaryButton.onClick}
                variant="primary"
              />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'auto',
            paddingTop: '1.25rem',
          }}
        >
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};

export default ZUIDrawerModal;
