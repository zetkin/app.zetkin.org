import { Box, IconButton } from '@material-ui/core';
import { Clear, Edit } from '@material-ui/icons';
import Image, { ImageProps } from 'next/image';

interface ZetkinEditableImageProps {
  alt: string;
  src: string;
  onEdit: () => void;
  onReset: () => void;
}

const ZetkinEditableImage: React.FC<ZetkinEditableImageProps & ImageProps> = ({
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
          onClick={() => onReset()}
          style={{
            backgroundColor: 'rgba(255,255,255,0.7)',
            marginRight: 10,
          }}
        >
          <Clear />
        </IconButton>
        <IconButton
          onClick={() => onEdit()}
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

export default ZetkinEditableImage;
