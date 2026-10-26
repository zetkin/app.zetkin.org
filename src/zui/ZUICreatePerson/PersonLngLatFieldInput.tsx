import 'maplibre-gl/dist/maplibre-gl.css';

import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { Undo } from '@mui/icons-material';
import { Map, Marker } from '@vis.gl/react-maplibre';
import { FC, useState } from 'react';

import { useEnv } from 'core/hooks';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import EditLocationDialog from 'zui/ZUICreatePerson/EditLocationDialog';
import { ZetkinLngLatFieldValue } from 'utils/types/zetkin';
import messageIds from 'zui/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import profileMessageIds from 'features/profile/l10n/messageIds';

type PersonLngLatFieldInputProps = {
  disabled?: boolean;
  error?: boolean;
  field: string;
  hasChanges?: boolean;
  label: string;
  onChange: (field: string, newValue: string) => void;
  onReset?: () => void;
  value: ZetkinLngLatFieldValue | null;
};

const PersonLngLatFieldInput: FC<PersonLngLatFieldInputProps> = ({
  disabled = false,
  error,
  field,
  hasChanges = false,
  value,
  label,
  onChange,
  onReset,
}) => {
  const messages = useMessages(messageIds);
  const profileMessages = useMessages(profileMessageIds);

  const env = useEnv();
  const [mapOpen, setMapOpen] = useState(false);

  const inputValue = value ? Object.values(value).join(',') : '';

  const hasValue = !!value;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
          }}
        >
          <Box alignItems="flex-start" display="flex" flex={1}>
            {!hasValue && (
              <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                <Box
                  onClick={() => {
                    if (!disabled) {
                      setMapOpen(true);
                    }
                  }}
                  sx={(theme) => ({
                    ':hover': {
                      border: !disabled
                        ? `1px solid ${theme.palette.text.primary}`
                        : '',
                    },
                    alignItems: 'center',
                    //Hardcoding a hex value here to match MUI textfield border color
                    border: '1px solid #c4c4c4',
                    borderRadius: 1,
                    cursor: !disabled ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    //Hardcoding weird height here to match MUI textfield height
                    height: '56px',
                    justifyContent: 'space-between',
                    width: '100%',
                  })}
                >
                  <Typography
                    color={!disabled ? 'secondary' : 'textDisabled'}
                    sx={{ paddingLeft: '14px' }}
                  >
                    {label}
                  </Typography>
                  <Tooltip
                    arrow
                    title={messages.createPerson.location.mapIconTooltip()}
                  >
                    <IconButton
                      disabled={disabled}
                      onClick={() => {
                        setMapOpen(true);
                      }}
                    >
                      <MapIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {disabled && (
                  <Box
                    sx={{ lineHeight: 1, marginLeft: '14px', marginTop: '3px' }}
                  >
                    <Typography color="textDisabled" variant="caption">
                      <Msg id={profileMessageIds.customFields.notEditable} />
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            {hasValue && (
              <TextField
                disabled={true}
                error={error}
                fullWidth
                helperText={
                  !disabled
                    ? messages.createPerson.location.helperText()
                    : profileMessages.customFields.notEditable()
                }
                label={label}
                onBlur={(e) => onChange(field, e.target.value.trim())}
                onChange={(e) => onChange(field, e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Tooltip arrow title="Edit in map">
                        <IconButton
                          disabled={disabled}
                          onClick={() => setMapOpen(true)}
                        >
                          <MapIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  },
                }}
                value={inputValue}
              />
            )}
            {hasChanges && (
              <IconButton onClick={onReset} sx={{ marginTop: 1 }}>
                <Undo />
              </IconButton>
            )}
          </Box>
        </Box>
        {hasValue && (
          <Map
            interactive={false}
            latitude={value.lat}
            longitude={value.lng}
            mapStyle={env.vars.MAPLIBRE_STYLE}
            onClick={() => {
              if (!disabled) {
                setMapOpen(true);
              }
            }}
            RTLTextPlugin="/mapbox-gl-rtl-text-0.3.0.js"
            style={{
              cursor: !disabled ? 'pointer' : 'not-allowed',
              height: 200,
              width: '100%',
            }}
            zoom={12}
          >
            <Marker
              anchor="bottom"
              draggable={false}
              latitude={value.lat}
              longitude={value.lng}
              offset={[0, 6]}
            >
              <MarkerIcon color="#000000" selected />
            </Marker>
          </Map>
        )}
      </Box>
      <EditLocationDialog
        initialLocation={value ?? undefined}
        onClearLocation={() => onChange(field, '')}
        onMapClose={() => {
          setMapOpen(false);
        }}
        onSelectLocation={(location) => {
          // HACK: The `form` tooling only accepts values as `string`, so we force-cast
          onChange(field, location as unknown as string);
        }}
        open={mapOpen}
      />
    </>
  );
};

export default PersonLngLatFieldInput;
