import { SelectedViewColumn } from '../types';
import SmartSearch from 'features/smartSearch/components/SmartSearchDialog/SmartSearch';

interface LocalQueryConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const LocalQueryConfig = ({ onOutputConfigured }: LocalQueryConfigProps) => {
  return (
    <SmartSearch
      hasSaveCancelButtons={false}
      onOutputConfigured={onOutputConfigured}
    />
  );
};

export default LocalQueryConfig;
