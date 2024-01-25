import { Box, Button, Typography } from '@mui/material';
import { FC, useState } from 'react';

import BlockListItemBase from './BlockListItemBase';
import FileLibraryDialog from 'features/files/components/FileLibraryDialog';
import { LibraryImageData } from '../tools/LibraryImage/types';
import messageIds from 'features/emails/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';

interface ImageBlockListItemProps {
  data: LibraryImageData;
  hasErrors: boolean;
  onChange: (newData: LibraryImageData) => void;
  selected: boolean;
}

const ImageBlockListItem: FC<ImageBlockListItemProps> = ({
  data: initialData,
  hasErrors,
  onChange,
  selected,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);

  const [selecting, setSelecting] = useState(false);
  const [data, setData] = useState(initialData);

  return (
    <BlockListItemBase
      excerpt={data.fileName}
      hasErrors={hasErrors}
      selected={selected}
      title={messages.editor.tools.titles.libraryImage()}
    >
      <Box display="flex">
        <Box
          height="80px"
          onClick={() => setSelecting(true)}
          sx={{ cursor: 'pointer' }}
          width="80px"
        >
          <img
            alt=""
            src={data.url}
            style={{
              height: '100%',
              objectFit: 'cover',
              width: '100%',
            }}
          />
        </Box>
        <Box
          alignItems="flex-start"
          display="flex"
          flex={1}
          flexDirection="column"
          justifyContent="flex-end"
          overflow="hidden"
          paddingLeft={2}
        >
          <Typography
            color="secondary"
            maxWidth="80%"
            noWrap
            overflow="hidden"
            textOverflow="ellipsis"
            variant="body2"
          >
            {data.fileName}
          </Typography>
          <Button
            onClick={() => setSelecting(true)}
            sx={{ marginTop: 1 }}
            variant="outlined"
          >
            <Msg id={messageIds.editor.tools.libraryImage.changeImage} />
          </Button>
        </Box>
      </Box>
      <FileLibraryDialog
        onClose={() => setSelecting(false)}
        onSelectFile={(file) => {
          setData({
            fileId: file.id,
            fileName: file.original_name,
            url: file.url,
          });
          onChange({
            fileId: file.id,
            fileName: file.original_name,
            url: file.url,
          });
          setSelecting(false);
        }}
        open={selecting}
        orgId={orgId}
        type="image"
      />
    </BlockListItemBase>
  );
};

export default ImageBlockListItem;
