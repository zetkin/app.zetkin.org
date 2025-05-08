import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { Close } from '@mui/icons-material';

import ZUIIconButton from '../ZUIIconButton';
import { ZUIModalProps } from '.';
import ZUIButton from '../ZUIButton';

type ModalContentProps = Pick<
  ZUIModalProps,
  'children' | 'onClose' | 'title' | 'primaryButton' | 'secondaryButton'
> & {
  isMobile: boolean;
};

const ModalContent: FC<ModalContentProps> = ({
  children,
  isMobile,
  onClose,
  primaryButton,
  secondaryButton,
  title,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        maxHeight: 'calc(100dvh - 3.75rem)',
        maxWidth: isMobile ? '100%' : 'calc(100dvw - 2.5rem)',
        overflowY: 'hidden',
        padding: '1.25rem',
      }}
    >
      <Box
        sx={(theme) => ({
          alignItems: 'flex-start',
          borderBottom: children
            ? `0.063rem solid ${theme.palette.dividers.lighter}`
            : '',
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: children ? '1rem' : '',
        })}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography variant="headingMd">{title}</Typography>
          {onClose && (
            <ZUIIconButton icon={Close} onClick={onClose} size="small" />
          )}
        </Box>
      </Box>
      {children && (
        <Box
          sx={{
            display: 'flex',
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          paddingTop: '1.25rem',
        }}
      >
        {secondaryButton && (
          <ZUIButton
            href={
              'href' in secondaryButton && !!secondaryButton.href
                ? secondaryButton.href
                : undefined
            }
            label={secondaryButton.label}
            onClick={
              'onClick' in secondaryButton ? secondaryButton.onClick : undefined
            }
            variant="secondary"
          />
        )}
        <ZUIButton
          href={
            'href' in primaryButton && !!primaryButton.href
              ? primaryButton.href
              : undefined
          }
          label={primaryButton.label}
          onClick={
            'onClick' in primaryButton ? primaryButton.onClick : undefined
          }
          variant="primary"
        />
      </Box>
    </Box>
  );
};

export default ModalContent;
