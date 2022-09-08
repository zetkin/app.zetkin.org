import Link from 'next/link';
import { AttachFile, Image as ImageIcon } from '@material-ui/icons';
import { Chip, CircularProgress, useTheme } from '@material-ui/core';

import { ZetkinFile } from 'utils/types/zetkin';
import {
  FileUpload,
  FileUploadState,
} from 'features/files/hooks/useFileUploads';

interface FileChipProps {
  loading?: boolean;
  mimeType?: string;
  name: string;
  onDelete?: () => void;
  url?: string;
}

const FileChip: React.FC<FileChipProps> = ({
  loading,
  mimeType,
  name,
  onDelete,
  url,
}) => {
  const theme = useTheme();

  let icon = <AttachFile />;

  if (mimeType?.startsWith('image')) {
    icon = <ImageIcon />;
  }

  let output = (
    <Chip
      avatar={loading ? <CircularProgress size={20} /> : icon}
      component="a"
      label={name}
      onDelete={onDelete}
      style={{
        color: theme.palette.text.primary,
        fontWeight: 'normal',
        marginBottom: '4px',
        marginRight: '4px',
      }}
    />
  );

  if (url) {
    output = (
      <Link href={url} passHref>
        {output}
      </Link>
    );
  }

  return output;
};

export const ZetkinFileObjectChip: React.FC<{
  file: ZetkinFile;
  onDelete?: () => void;
}> = ({ file, onDelete }) => (
  <FileChip
    mimeType={file.mime_type}
    name={file.original_name}
    onDelete={onDelete}
    url={file.url}
  />
);

export const ZetkinFileUploadChip: React.FC<{
  fileUpload: FileUpload;
  onDelete?: () => void;
}> = ({ fileUpload, onDelete }) => (
  <FileChip
    loading={fileUpload.state == FileUploadState.UPLOADING}
    mimeType={fileUpload.apiData?.mime_type}
    name={fileUpload.name}
    onDelete={onDelete}
  />
);

export default FileChip;
