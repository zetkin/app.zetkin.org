import { FC } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { Msg } from 'core/i18n';
import messageIdsAss from 'features/areaAssignments/l10n/messageIds';
import { MapStyle } from 'features/areaAssignments/components/OrganizerMap';

type Props = {
  areaStyle: MapStyle['area'];
  onAreaStyleChange: (newValue: MapStyle['area']) => void;
};

const VALID_AREA_STYLES = [
  'households',
  'assignees',
  'progress',
  'hide',
  'outlined',
] as const;

function isAreaStyle(value: string): value is MapStyle['area'] {
  return (VALID_AREA_STYLES as readonly string[]).includes(value);
}

const AreaColorSettings: FC<Props> = ({ areaStyle, onAreaStyleChange }) => {
  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flexDirection="column"
      gap={1}
      paddingRight={2}
      paddingTop={1}
      sx={{ overflowY: 'auto' }}
    >
      <FormControl component="fieldset" variant="outlined">
        <Box display="flex" gap={1} paddingBottom={1}>
          <Typography>
            <Msg id={messageIdsAss.map.mapStyle.area.label} />
          </Typography>
        </Box>
        <RadioGroup
          onChange={(ev) => {
            const newValue = ev.target.value;
            if (isAreaStyle(newValue)) {
              onAreaStyleChange(newValue);
            }
          }}
          sx={{ ml: 1 }}
          value={areaStyle}
        >
          {[
            {
              label: messageIdsAss.map.mapStyle.area.options.assignees,
              value: 'assignees',
            },
            {
              label: messageIdsAss.map.mapStyle.area.options.households,
              value: 'households',
            },
            {
              label: messageIdsAss.map.mapStyle.area.options.progress,
              value: 'progress',
            },
            {
              label: messageIdsAss.map.mapStyle.area.options.outlined,
              value: 'outlined',
            },
            {
              label: messageIdsAss.map.mapStyle.area.options.hidden,
              value: 'hide',
            },
          ].map(({ value, label }) => (
            <FormControlLabel
              key={value}
              control={<Radio />}
              label={<Msg id={label} />}
              value={value}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default AreaColorSettings;
