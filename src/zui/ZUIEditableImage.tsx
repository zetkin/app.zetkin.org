import { Box, IconButton } from '@mui/material';
import { Clear, Edit } from '@mui/icons-material';
import Image, { ImageProps } from 'next/image';

interface ZUIEditableImageProps {
  alt: string;
  src: string;
  onEdit: () => void;
  onReset: () => void;
}

const ZUIEditableImage: React.FC<ZUIEditableImageProps & ImageProps> = ({
  alt,
  onEdit,
  onReset,
  src,
  ...imageProps
}) => {
  return (
    <Box style={{ position: 'relative' }}>
      <Box style={{ bottom: 10, position: 'absolute', right: 10, zIndex: 1 }}>
        <IconButton
          data-testid="ZetkinEditableImage-resetButton"
          onClick={() => onReset()}
          size="large"
          style={{
            backgroundColor: 'rgba(255,255,255,0.7)',
            marginRight: 10,
          }}
        >
          <Clear />
        </IconButton>
        <IconButton
          data-testid="ZetkinEditableImage-editButton"
          onClick={() => onEdit()}
          size="large"
          style={{
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}
        >
          <Edit />
        </IconButton>
      </Box>
      <Image {...imageProps} alt={alt} src={src} />
    </Box>
  );
};

export default ZUIEditableImage;
