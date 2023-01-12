import { Box } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

interface MultiIconCardVisualProps {
  color: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
}

const MultiIconCardVisual = ({
  color,
  icon: Icon,
}: MultiIconCardVisualProps) => {
  return (
    <>
      <Box
        alignItems="center"
        bgcolor="white"
        borderRadius="50%"
        display="flex"
        justifyContent="center"
      >
        <Icon sx={{ color: color, fontSize: '60px', margin: 2 }} />
      </Box>
      <svg
        fill="none"
        style={{ marginLeft: '-20px' }}
        viewBox="65 0 123 85"
        width="129"
      >
        <path
          clipRule="evenodd"
          d="M65.6748 83.1026C80.6962 75.5319 90.9998 59.969 90.9998 41.9995C90.9998 24.0301 80.6962 8.46718 65.6748 0.896484C84.7084 4.89353 98.9998 21.7776 98.9998 41.9995C98.9998 62.2215 84.7084 79.1056 65.6748 83.1026Z"
          fill="white"
          fillRule="evenodd"
        />
        <path
          clipRule="evenodd"
          d="M80.6748 83.1026C95.6962 75.5319 106 59.969 106 41.9995C106 24.0301 95.6962 8.46718 80.6748 0.896484C99.7084 4.89353 114 21.7776 114 41.9995C114 62.2215 99.7084 79.1056 80.6748 83.1026Z"
          fill="white"
          fillRule="evenodd"
        />
        <path
          clipRule="evenodd"
          d="M95.6748 83.1026C110.696 75.5319 121 59.969 121 41.9995C121 24.0301 110.696 8.46718 95.6748 0.896484C114.708 4.89353 129 21.7776 129 41.9995C129 62.2215 114.708 79.1056 95.6748 83.1026Z"
          fill="white"
          fillRule="evenodd"
        />
      </svg>
    </>
  );
};

export default MultiIconCardVisual;
