import { Close, Done, QuestionMark, Undo } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { FC, ReactNode } from 'react';

import { useMessages } from 'core/i18n';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIIcon from 'zui/components/ZUIIcon';
import ZUIText from 'zui/components/ZUIText';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  children?: ReactNode;
  onEdit?: () => void;
  state: 'active' | 'failure' | 'success';
  subtitle?: JSX.Element;
  title: JSX.Element;
};

const StepBase: FC<Props> = ({ children, onEdit, subtitle, state, title }) => {
  const messages = useMessages(messageIds);

  const icons = {
    active: QuestionMark,
    failure: Close,
    success: Done,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        onClick={onEdit}
        sx={{
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: '1.875rem',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <Box
            sx={(theme) => ({
              alignItems: 'center',
              backgroundColor:
                state == 'failure'
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
        {onEdit && (
          <ZUIButton
            label={messages.report.summary.editButtonLabel()}
            onClick={() => onEdit()}
            size="small"
            startIcon={Undo}
          />
        )}
      </Box>
      <Box
        sx={(theme) => ({
          borderLeft: `1px solid ${theme.palette.dividers.main}`,
          marginLeft: '0.7rem',
          marginY: '0.25rem',
          minHeight: '0.25rem',
          paddingLeft: '1.25rem',
        })}
      >
        {subtitle && (
          <ZUIText noWrap variant="bodySmSemiBold">
            {subtitle}
          </ZUIText>
        )}
        {children && (
          <Stack sx={{ gap: '0.5rem', paddingY: '0.5rem' }}>{children}</Stack>
        )}
      </Box>
    </Box>
  );
};

export default StepBase;
