import { FC } from 'react';
import { TextField, Typography, useTheme } from '@mui/material';

import ZUIPreviewableInput, {
  ZUIPreviewableMode,
} from 'zui/ZUIPreviewableInput';

type HeadlinePreviewableInputProps = {
  focusInitially?: boolean;
  label?: string;
  mode: ZUIPreviewableMode;
  onChange: (value: string) => void;
  onSwitchMode: (newMode: ZUIPreviewableMode) => void;
  placeholder: string;
  value: string | undefined | null;
  variant: keyof typeof VARIANTS;
};

const VARIANTS = {
  content: { fontSize: '1.1em', whiteSpace: 'pre-line' },
  header: { fontSize: '2em' },
} as const;

const PreviewableSurveyInput: FC<HeadlinePreviewableInputProps> = ({
  focusInitially,
  label,
  mode,
  onChange,
  onSwitchMode,
  placeholder,
  value,
  variant,
}) => {
  const theme = useTheme();
  return (
    <ZUIPreviewableInput
      focusInitially={focusInitially}
      mode={mode}
      onSwitchMode={onSwitchMode}
      renderInput={(props) => (
        <TextField
          fullWidth
          label={label}
          multiline={variant === 'content'}
          onChange={(ev) => onChange(ev.target.value)}
          slotProps={{
            htmlInput: {
              ...props,
              sx: VARIANTS[variant],
            },
          }}
          sx={{ marginBottom: 2 }}
          value={value}
        />
      )}
      renderPreview={() => (
        <Typography
          color={
            value ? theme.palette.text.primary : theme.palette.text.disabled
          }
          marginBottom={2}
          sx={{ ...VARIANTS[variant], wordBreak: 'break-word' }}
        >
          {value || placeholder}
        </Typography>
      )}
      value={value || placeholder}
    />
  );
};

export default PreviewableSurveyInput;
