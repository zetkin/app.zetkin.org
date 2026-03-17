import { Box, IconButton } from '@mui/material';
import { RemirrorJSON } from 'remirror';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';

import { FileUpload } from 'features/files/hooks/useFileUploads';
import oldTheme from 'theme';
import { ZetkinFileUploadChip } from 'zui/ZUIFileChip';
import ZUIEditor from 'zui/ZUIEditor';
import { markdownToRemirror } from './utils/markdownToRemirror';
import { remirrorToMarkdown } from './utils/remirrorToMarkdown';

export interface ZUITextEditorProps {
  clear?: number;
  fileUploads?: FileUpload[];
  initialValue?: string;
  onChange: (value: string) => void;
  onCancelFile?: (file: FileUpload) => void;
  onClickAttach?: () => void;
  /**
   * @deprecated Will be ignored
   */
  placeholder?: string;
}

const ZUITextEditor: React.FunctionComponent<ZUITextEditorProps> = ({
  clear,
  fileUploads,
  initialValue,
  onChange,
  onCancelFile,
  onClickAttach,
  placeholder,
}) => {
  void placeholder;
  const [active, setActive] = useState<boolean>(false);
  const editorApiRef = useRef<null>(null);
  const [, setSelectedBlockIndex] = useState(0);

  const content = useMemo(() => {
    if (!initialValue) {
      return [];
    }
    return markdownToRemirror(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (clear && clear > 0) {
      setActive(false);
      onChange('');
    }
  }, [clear, onChange]);

  const handleChange = useCallback(
    (newContent: RemirrorJSON[]) => {
      const markdown = remirrorToMarkdown(newContent);
      onChange(markdown);
    },
    [onChange]
  );

  return (
    <Box
      sx={{
        '& a': {
          color: oldTheme.palette.primary.main,
          fontWeight: 600,
        },
        '&:hover': {
          borderColor: oldTheme.palette.onSurface.medium,
        },
        background: active ? 'white' : 'transparent',
        border: '1.5px solid',
        borderColor: active
          ? oldTheme.palette.onSurface.medium
          : oldTheme.palette.outline.main,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui',
        minHeight: 0,
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      <ZUIEditor
        content={content}
        editable={true}
        editorApiRef={editorApiRef}
        enableBold
        enableHeading
        enableItalic
        enableLink
        enableLists
        enableStrikethrough
        fullSize
        onChange={handleChange}
        onSelectBlock={(index) => setSelectedBlockIndex(index)}
      />
      {!!onClickAttach && (
        <Box
          sx={{
            bottom: 0,
            position: 'absolute',
            right: 0,
          }}
        >
          <IconButton onClick={onClickAttach} size="large">
            <AttachmentIcon />
          </IconButton>
        </Box>
      )}
      {fileUploads &&
        fileUploads.map((fileUpload) => {
          return (
            <ZetkinFileUploadChip
              key={fileUpload.key}
              fileUpload={fileUpload}
              onDelete={() => {
                if (onCancelFile) {
                  onCancelFile(fileUpload);
                }
              }}
            />
          );
        })}
    </Box>
  );
};

export default ZUITextEditor;
