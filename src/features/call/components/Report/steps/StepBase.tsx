import { Close, Done, QuestionMark, Undo } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import { useMessages } from 'core/i18n';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIIcon from 'zui/components/ZUIIcon';
import ZUIText from 'zui/components/ZUIText';
import messageIds from 'features/call/l10n/messageIds';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUIIconButton from 'zui/components/ZUIIconButton';

type Props = {
  children?: ReactNode;
  onEdit?: () => void;
  state: 'active' | 'failure' | 'success';
  subtitle?: JSX.Element;
  title: JSX.Element;
};

const StepBase: FC<Props> = ({ children, onEdit, subtitle, state, title }) => {
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);

  const icons = {
    active: QuestionMark,
    failure: Close,
    success: Done,
  };

  let topDistance = 32;
  if (!subtitle && isMobile) {
    topDistance = 27;
  } else if (!subtitle && !isMobile) {
    topDistance = 30;
  }

  return (
    <Box
      sx={(theme) => ({
        '&::before': {
          backgroundColor: theme.palette.dividers.main,
          content: '""',
          display: 'block',
          height: isMobile ? 'calc(100% - 40px)' : 'calc(100% - 38px)',
          left: 12,
          minHeight: '4px',
          position: 'absolute',
          top: topDistance,
          width: '1px',
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      })}
    >
      <Box
        onClick={onEdit}
        sx={{
          alignItems: isMobile ? 'flex-start' : 'center',
          cursor: onEdit ? 'pointer' : 'default',
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: '1.875rem',
        }}
      >
        <Box
          sx={{
            alignItems: isMobile ? 'flex-start' : 'center',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <Box
            sx={(theme) => ({
              alignItems: 'center',
              backgroundColor:
                state === 'failure'
                  ? theme.palette.secondary.light
                  : theme.palette.primary.main,
              borderRadius: '5rem',
              display: 'flex',
              justifyContent: 'center',
              padding: '2px',
            })}
          >
            <ZUIIcon color="white" icon={icons[state]} size="small" />
          </Box>
          <ZUIText variant="headingMd">{title}</ZUIText>
        </Box>
        {onEdit && !isMobile && (
          <ZUIButton
            label={messages.report.summary.editButtonLabel()}
            onClick={() => onEdit()}
            size="small"
            startIcon={Undo}
          />
        )}
        {onEdit && isMobile && (
          <ZUIIconButton icon={Undo} onClick={() => onEdit()} size="small" />
        )}
      </Box>
      <Box
        sx={{
          marginLeft: '0.7rem',
          minHeight: '0.25rem',
          paddingBottom: '0.75rem',
          paddingLeft: '1.25rem',
          paddingTop: '0.5rem',
        }}
      >
        {subtitle && (
          <ZUIText noWrap={isMobile ? false : true} variant="bodySmSemiBold">
            {subtitle}
          </ZUIText>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default StepBase;
