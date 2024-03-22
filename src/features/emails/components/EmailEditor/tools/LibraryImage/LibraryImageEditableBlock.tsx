/* eslint-disable sort-keys */
/* eslint-disable @next/next/no-img-element*/
import { FC, useState } from 'react';

import { BlockAttributes } from 'features/emails/types';
import { defaultImageAttributes } from '../../utils/defaultBlockAttributes';
import FileLibraryDialog from 'features/files/components/FileLibraryDialog';

export type LibraryImageData = {
  fileId: number;
  fileName: string;
  url: string;
};

type Props = {
  attributes?: BlockAttributes['image'];
  data: LibraryImageData;
  onChange: (data: LibraryImageData) => void;
  orgId: number;
};

const LibraryImageEditableBlock: FC<Props> = ({
  attributes = {},
  data: initialData,
  onChange,
  orgId,
}) => {
  // Start in "selecting" state if the block was just added
  const [selecting, setSelecting] = useState(!initialData.fileId);
  const [data, setData] = useState(initialData);

  // TODO: Add way of handling alt text
  return (
    <>
      {data.url && (
        <img
          alt=""
          src={data.url}
          style={{
            borderBottom: attributes['border-bottom']
              ? attributes['border-bottom']
              : defaultImageAttributes['borderBottom'],
            borderLeft: attributes['border-left']
              ? attributes['border-left']
              : defaultImageAttributes['borderLeft'],
            borderRadius: attributes['border-radius']
              ? attributes['border-radius']
              : defaultImageAttributes['borderRadius'],
            borderRight: attributes['border-right']
              ? attributes['border-right']
              : defaultImageAttributes['borderRight'],
            borderTop: attributes['border-top']
              ? attributes['border-top']
              : defaultImageAttributes['borderTop'],
            border: attributes['border']
              ? attributes['border']
              : defaultImageAttributes['border'],
            marginBottom: attributes['padding-bottom']
              ? `${attributes['padding-bottom']}px`
              : defaultImageAttributes['marginBottom'],
            marginLeft: attributes['padding-left']
              ? `${attributes['padding-left']}px`
              : defaultImageAttributes['marginLeft'],
            marginRight: attributes['padding-right']
              ? `${attributes['padding-right']}px`
              : defaultImageAttributes['marginRight'],
            marginTop: attributes['padding-top']
              ? `${attributes['padding-top']}px`
              : defaultImageAttributes['marginTop'],
            margin: attributes['padding']
              ? attributes['padding']
              : defaultImageAttributes['margin'], //This looks wrong, but in mjml "style" the word padding is what in css is called margin
            maxWidth: '100%',
          }}
        />
      )}
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
    </>
  );
};

export default LibraryImageEditableBlock;
