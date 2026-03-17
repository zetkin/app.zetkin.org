import { Box, IconButton } from '@mui/material';
import { RemirrorJSON } from 'remirror';
import React, { MutableRefObject, useCallback, useMemo, useRef } from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';

import { FileUpload } from 'features/files/hooks/useFileUploads';
import oldTheme from 'theme';
import { ZetkinFileUploadChip } from 'zui/ZUIFileChip';
import ZUIEditor, { ZUIEditorApi } from 'zui/ZUIEditor';
import { markdownToRemirror } from './utils/markdownToRemirror';
import { remirrorToMarkdown } from './utils/remirrorToMarkdown';

export interface ZUITextEditorProps {
  /**
   * @deprecated Will be ignored. Use editorApiRef instead
   */
  clear?: number;
  editorApiRef?: MutableRefObject<ZUIEditorApi | null>;
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
  editorApiRef: propEditorApiRef,
  fileUploads,
  initialValue,
  onChange,
  onCancelFile,
  onClickAttach,
  placeholder,
}) => {
  void clear;
  void placeholder;

  const localEditorApiRef = useRef<ZUIEditorApi | null>(null);
  const editorApiRef = propEditorApiRef || localEditorApiRef;

  const content = useMemo(() => {
    if (!initialValue) {
      return [];
    }
    return markdownToRemirror(initialValue);
  }, [initialValue]);

  const handleChange = useCallback(
    (newContent: RemirrorJSON[]) => {
      const markdown = remirrorToMarkdown(newContent);
      onChange(markdown);
    },
    [onChange]
  );

  return (
    <Box
      onClick={() => {
        editorApiRef.current?.focus();
      }}
      sx={{
        '&:hover': {
          borderColor: oldTheme.palette.onSurface.medium,
        },
        border: '1.5px solid',
        borderColor: oldTheme.palette.outline.main,
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
