import { Box } from '@mui/material';
import { ZetkinViewColumn } from '../types';

interface LocalSmartSearchConfigProps {
  onOutputConfigured: (columns: ZetkinViewColumn[]) => void;
}

const LocalSmartSearchConfig = ({
  onOutputConfigured,
}: LocalSmartSearchConfigProps) => {
  return <Box onClick={() => onOutputConfigured([])}></Box>;
};

export default LocalSmartSearchConfig;
