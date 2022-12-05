import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

import PrettyEmail from './PrettyEmail';
import { ZetkinFile } from 'utils/types/zetkin';

interface EmailLoaderProps {
  file: ZetkinFile;
}

const EmailLoader: React.FC<EmailLoaderProps> = ({ file }) => {
  const [fileData, setFileData] = useState<string | null>(null);

  async function loadFileData(url: string) {
    const res = await fetch(url);
    const text = await res.text();
    setFileData(text);
  }

  useEffect(() => {
    setFileData(null);
    loadFileData(file.url);
  }, [file]);

  if (!fileData) {
    return <CircularProgress />;
  }

  return <PrettyEmail emailStr={fileData} />;
};

export default EmailLoader;
