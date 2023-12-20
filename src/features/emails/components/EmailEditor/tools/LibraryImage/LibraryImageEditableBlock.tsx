import { FC, useState } from 'react';

import { LibraryImageData } from './types';
import ZUIImageSelectDialog from 'zui/ZUIImageSelectDialog';

type Props = {
  data: LibraryImageData;
  onChange: (data: LibraryImageData) => void;
  orgId: number;
};

const LibraryImageEditableBlock: FC<Props> = ({
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
            maxWidth: '100%',
          }}
        />
      )}
      <ZUIImageSelectDialog
        onClose={() => setSelecting(false)}
        onSelectFile={(file) => {
          setData({
            fileId: file.id,
            url: file.url,
          });

          onChange({
            fileId: file.id,
            url: file.url,
          });
          setSelecting(false);
        }}
        open={selecting}
        orgId={orgId}
      />
    </>
  );
};

export default LibraryImageEditableBlock;
