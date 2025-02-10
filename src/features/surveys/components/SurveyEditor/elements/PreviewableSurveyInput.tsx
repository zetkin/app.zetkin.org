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
  content: { fontSize: '1.1em' },
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
          inputProps={{ ...props, sx: VARIANTS[variant] }}
          label={label}
          multiline={variant === 'content'}
          onChange={(ev) => onChange(ev.target.value)}
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
          sx={VARIANTS[variant]}
        >
          {value || placeholder}
        </Typography>
      )}
      value={value || placeholder}
    />
  );
};

export default PreviewableSurveyInput;
