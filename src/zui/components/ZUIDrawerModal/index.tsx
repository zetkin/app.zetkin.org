import { ChevronRight, KeyboardArrowDown } from '@mui/icons-material';
import { Box, Fade, IconButton, Modal, Slide, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import { MUIIcon } from '../types';
import AvatarBackground from '../ZUIAvatar/AvatarBackground';
import ZUIButton from '../ZUIButton';
import ModalBackground from '../ZUIModal/ModalBackground';

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
   * The secondary action button in the modal header.
   */
  secondaryButton?: {
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
  secondaryButton,
  subtitle,
  title,
}) => {
  const hasHeaderContent = !!Icon || !!title || !!featureName || !!subtitle;
  return (
    <Modal
      disableRestoreFocus
      onClose={onClose}
      open={open}
      slots={{
        backdrop: () => (
          <Fade in={open} timeout={300}>
            <Box
              onClick={onClose}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.5)',
                height: '100%',
                width: '100%',
              }}
            >
              <ModalBackground height="100%" width="100%" />
            </Box>
          </Fade>
        ),
      }}
    >
      <Slide direction="up" in={open} timeout={300}>
        <Box
          sx={{
            backgroundColor: 'white',
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            left: 0,
            maxHeight: '100%',
            outline: 0,
            pointerEvents: open ? 'auto' : 'none',
            position: 'fixed',
            right: 0,
            top: 'auto',
            width: '100%',
          }}
        >
          <IconButton
            onClick={() => onClose()}
            onKeyUp={(ev) => {
              if (ev.key == 'Enter') {
                onClose();
              }
            }}
            sx={(theme) => ({
              '&:hover': {
                backgroundColor: theme.palette.common.white,
              },
              alignItems: 'center',
              backgroundColor: theme.palette.common.white,
              borderRadius: '100%',
              cursor: 'pointer',
              display: 'flex',
              height: '2rem',
              justifyContent: 'center',
              left: '50%',
              position: 'absolute',
              top: -40,
              transform: 'translateX(-50%)',
              visibility: open ? 'visible' : 'hidden',
              width: '2rem',
            })}
            tabIndex={0}
          >
            <KeyboardArrowDown color="secondary" />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100dvh - 3.75rem)',
              overflowY: 'hidden',
              padding: '1.25rem',
            }}
          >
            {hasHeaderContent && (
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
                    {title && (
                      <Typography variant="headingMd">{title}</Typography>
                    )}
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
                  {secondaryButton && (
                    <ZUIButton
                      label={secondaryButton.label}
                      onClick={secondaryButton.onClick}
                      variant="secondary"
                    />
                  )}
                  {primaryButton && (
                    <ZUIButton
                      label={primaryButton.label}
                      onClick={primaryButton.onClick}
                      variant="primary"
                    />
                  )}
                </Box>
              </Box>
            )}
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
        </Box>
      </Slide>
    </Modal>
  );
};

export default ZUIDrawerModal;
