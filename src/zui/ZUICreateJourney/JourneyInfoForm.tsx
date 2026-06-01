import { Box } from '@mui/material';
import { FC } from 'react';

import { ZetkinCreateJourney } from 'utils/types/zetkin';
import JourneyFieldInput from './JourneyFieldInput';

interface JourneyInfoFormProps {
  onChange: (field: string, value: string | null) => void;
  journeyInfo: ZetkinCreateJourney;
}

const JourneyInfoForm: FC<JourneyInfoFormProps> = ({
  onChange,
  journeyInfo,
}) => {
  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      gap={2}
      sx={{
        height: '',
        overflowY: 'auto',
        p: '0 40px 20px 0',
      }}
    >
      <Box display="flex" mt={1}>
        <JourneyFieldInput
          field={'title'}
          onChange={(field, value) => {
            onChange(field, value);
          }}
          required
          value={journeyInfo.title || ''}
        />
      </Box>
      <Box display="flex" mt={1}>
        <Box mr={2} width="50%">
          <JourneyFieldInput
            field={'plural_label'}
            onChange={(field, value) => onChange(field, value)}
            required
            value={journeyInfo.plural_label || ''}
          />
        </Box>
        <Box width="50%">
          <JourneyFieldInput
            field={'singular_label'}
            onChange={(field, value) => onChange(field, value)}
            required
            value={journeyInfo.singular_label || ''}
          />
        </Box>
      </Box>
      <Box>
        <JourneyFieldInput
          field={'opening_note_template'}
          onChange={(field, value) => onChange(field, value)}
          value={journeyInfo.opening_note_template || ''}
        />
      </Box>
    </Box>
  );
};

export default JourneyInfoForm;
