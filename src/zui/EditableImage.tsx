import { Box, IconButton } from '@material-ui/core';
import { Clear, Edit } from '@material-ui/icons';
import Image, { ImageProps } from 'next/image';

interface EditableImageProps {
  alt: string;
  src: string;
  onEdit: () => void;
  onReset: () => void;
}

const EditableImage: React.FC<EditableImageProps & ImageProps> = ({
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

export default EditableImage;
