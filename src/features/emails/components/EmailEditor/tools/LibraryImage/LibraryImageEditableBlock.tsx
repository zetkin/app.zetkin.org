import { FC } from 'react';
import { LibraryImageData } from './types';

type Props = {
  data: LibraryImageData;
};

const LibraryImageEditableBlock: FC<Props> = ({ data }) => {
  return <h1>IMAGE PLACEHOLDER {JSON.stringify(data)}</h1>;
};

export default LibraryImageEditableBlock;
