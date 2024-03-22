import { Box, SxProps, useTheme } from '@mui/material';
import { FC, ReactNode, useState } from 'react';

interface TransparentGridBackgroundProps {
  children: ReactNode;
  highGridIntensity?: number;
  interactive?: boolean;
  lowGridIntensity?: number;
  sx?: SxProps;
}

const TransparentGridBackground: FC<TransparentGridBackgroundProps> = ({
  children,
  lowGridIntensity: defaultGridIntensity = 0.02,
  highGridIntensity: hoverGridIntensity = 0.15,
  interactive = true,
  sx,
}) => {
  const theme = useTheme();
  const [gridIntensity, setGridIntensity] = useState(
    interactive ? defaultGridIntensity : hoverGridIntensity
  );
  return (
    <Box
      border={1}
      borderColor={theme.palette.grey[400]}
      borderRadius={1}
      onMouseEnter={() => {
        setGridIntensity(hoverGridIntensity);
      }}
      onMouseLeave={() => {
        if (interactive) {
          setGridIntensity(defaultGridIntensity);
        }
      }}
      sx={{
        backgroundColor: '#eee',
        backgroundImage: `linear-gradient(45deg, rgba(0,0,0,${gridIntensity}) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,${gridIntensity}) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,${gridIntensity}) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,${gridIntensity}) 75%);`,
        backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
        backgroundSize: '30px 30px',
        transition: 'backgroundImage 0.2s',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default TransparentGridBackground;
