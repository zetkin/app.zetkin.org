import { FC } from 'react';
import { Box } from '@mui/material';

import { FieldIcon } from './FieldIcon';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import { FIELD_PRESENTATION, PresentableField } from './Event';
import theme from '../../../../theme';

interface FieldProps {
  field: PresentableField;
}

const Field: FC<FieldProps> = ({ field }) => {
  const labelColor = field.requiresAction ? 'error' : 'secondary';
  const icon = (
    <Box
      sx={{
        alignItems: 'center',
        color: field.requiresAction
          ? theme.palette.error.main
          : theme.palette.secondary.main,
        display: 'flex',
      }}
    >
      <FieldIcon field={field} />
    </Box>
  );

  if (field.presentation === FIELD_PRESENTATION.ICON_ONLY) {
    return icon;
  }

  return (
    <ZUIIconLabel
      color={labelColor}
      icon={icon}
      label={field.message}
      size="sm"
    />
  );
};

export default Field;
