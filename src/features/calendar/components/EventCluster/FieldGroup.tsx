import { Box } from '@mui/material';
import { FC } from 'react';

import Field from './Field';
import { FIELD_PRESENTATION, PresentableField } from './Event';

interface FieldGroupProps {
  fields: PresentableField[];
  height: number;
}

const FieldGroup: FC<FieldGroupProps> = ({ fields, height }) => {
  const fieldsWithLabel = fields.filter(
    (f) => f.presentation === FIELD_PRESENTATION.WITH_LABEL
  );
  const fieldsWithIconOnly = fields.filter(
    (f) => f.presentation === FIELD_PRESENTATION.ICON_ONLY
  );
  return (
    <Box
      height={height}
      sx={{
        display: 'flex',
        flexFlow: 'column',
        gap: '4px 0',
        paddingLeft: '8px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '0 4px',
          paddingRight: '4px',
          position: 'absolute',
          right: 0,
          top: 2,
        }}
      >
        {fieldsWithIconOnly.map((field, index) => (
          <Field key={`${field.kind}-${index}`} field={field} />
        ))}
      </Box>
      {fieldsWithLabel.map((field, index) => (
        <Field key={`${field.kind}-${index}`} field={field} />
      ))}
    </Box>
  );
};

export default FieldGroup;
