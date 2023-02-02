import { SelectedViewColumn } from '../types';
import SmartSearch from 'features/smartSearch/components/SmartSearchDialog/SmartSearch';

interface LocalSmartSearchConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const LocalSmartSearchConfig = ({
  onOutputConfigured,
}: LocalSmartSearchConfigProps) => {
  return (
    <SmartSearch
      hasSaveCancelButtons={false}
      onOutputConfigured={onOutputConfigured}
    />
  );
};

export default LocalSmartSearchConfig;
