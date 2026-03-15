import 'maplibre-gl/dist/maplibre-gl.css';

import MapIcon from '@mui/icons-material/Map';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, IconButton, Typography } from '@mui/material';
import { Map, Marker } from '@vis.gl/react-maplibre';
import { ComponentProps, FC, useState } from 'react';

import { useEnv } from 'core/hooks';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import EditLocationDialog from 'features/profile/components/EditLocationDialog';
import { isLngLatValue } from 'utils/mapUtils';
import { ZetkinCustomFieldValue } from 'utils/types/zetkin';
import PersonFieldInput from 'zui/ZUICreatePerson/PersonFieldInput';
import FieldValidationWarning from './FieldValidationWarning';

type PersonLngLatFieldInputProps = {
  disabled?: boolean;
  error?: boolean;
  field: string;
  hasChanges?: boolean;
  label?: string;
  onChange?: (field: string, newValue: string) => void;
  onReset?: () => void;
  required?: boolean;
  value: ZetkinCustomFieldValue;
};

const PersonLngLatFieldInput: FC<PersonLngLatFieldInputProps> = ({
  disabled = false,
  error,
  field,
  hasChanges = false,
  label,
  onChange,
  onReset,
  required,
  value,
}) => {
  const env = useEnv();
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

  const hasValue = isLngLatValue(value);

  const lngLatCommonpProps = {
    disabled,
    error,
    field,
    required,
    value,
  };

  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flex={1}
      flexDirection="column"
      gap={1}
    >
      <Typography mb={1} variant="body2">
        {label}
      </Typography>
      <Box alignItems="center" display="flex" gap={1} width="100%">
        <LngLatFieldInput
          {...lngLatCommonpProps}
          label="Longitude"
          mode="lng"
        />
        <LngLatFieldInput {...lngLatCommonpProps} label="Latitude" mode="lat" />
        {hasChanges && (
          <IconButton onClick={() => onReset?.()}>
            <UndoIcon />
          </IconButton>
        )}
        <MapIcon
          color="secondary"
          onClick={() => {
            if (disabled) {
              return;
            }

            setIsMapOpen(true);
          }}
          sx={{ cursor: disabled ? 'default' : 'pointer' }}
        />
      </Box>
      {error && <FieldValidationWarning field={field} />}
      {hasValue && (
        <Map
          interactive={false}
          latitude={value.lat}
          longitude={value.lng}
          mapStyle={env.vars.MAPLIBRE_STYLE}
          RTLTextPlugin="/mapbox-gl-rtl-text-0.3.0.js"
          style={{ height: 200, width: '100%' }}
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

      <EditLocationDialog
        initialLocation={isLngLatValue(value) ? value : undefined}
        onMapClose={() => {
          setIsMapOpen(false);
        }}
        onSelectLocation={(location) => {
          // HACK: The `form` tooling only accepts values as `string`, so we force-cast
          onChange?.(field, location as unknown as string);
        }}
        open={isMapOpen}
      />
    </Box>
  );
};

type LngLatFieldInputProps = Pick<
  ComponentProps<typeof PersonFieldInput>,
  'error' | 'field' | 'label' | 'required'
> & {
  mode: 'lat' | 'lng';
  value: ZetkinCustomFieldValue;
};

const LngLatFieldInput: FC<LngLatFieldInputProps> = ({
  error,
  field,
  label,
  mode,
  required,
  value,
}) => {
  const hasValue = isLngLatValue(value);

  return (
    <PersonFieldInput
      disabled={true} // read-only lat/lng - editing is done via map
      error={error}
      field={`${field}.${mode}`}
      label={label}
      required={required}
      value={hasValue ? value[mode].toString() : ''}
    />
  );
};

export default PersonLngLatFieldInput;
