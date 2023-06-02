import { Box } from '@mui/material';
import { SelectedViewColumn } from '../types';
import SmartSearch from 'features/smartSearch/components/SmartSearchDialog/SmartSearch';

interface LocalQueryConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const LocalQueryConfig = ({ onOutputConfigured }: LocalQueryConfigProps) => {
  return (
    <Box sx={{ overFlowY: 'auto' }} width="100%">
      <SmartSearch
        hasSaveCancelButtons={false}
        onOutputConfigured={onOutputConfigured}
      />
    </Box>
  );
};

export default LocalQueryConfig;
