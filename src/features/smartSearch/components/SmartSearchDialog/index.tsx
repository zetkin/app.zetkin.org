import { Dialog, DialogContent } from '@mui/material';

import SmartSearch from './SmartSearch';
import { ZetkinQuery, ZetkinSmartSearchFilter } from 'utils/types/zetkin';

export interface SmartSearchDialogProps {
  initialSmartSearchFilter?: ZetkinSmartSearchFilter[];
  query?: ZetkinQuery | null;
  onDialogClose: () => void;
  onSave: (query: Pick<ZetkinQuery, 'filter_spec'>) => void;
  readOnly?: boolean;
}

const SmartSearchDialog = ({
  initialSmartSearchFilter,
  onDialogClose,
  onSave,
  query,
  readOnly,
}: SmartSearchDialogProps): JSX.Element => {
  return (
    <Dialog fullWidth maxWidth="xl" onClose={onDialogClose} open>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '85vh',
        }}
      >
        <SmartSearch
          initialSmartSearchFilter={initialSmartSearchFilter}
          onDialogClose={onDialogClose}
          onSave={onSave}
          query={query}
          readOnly={readOnly}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SmartSearchDialog;
