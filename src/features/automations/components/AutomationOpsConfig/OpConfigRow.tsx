import { FC } from 'react';
import { Box, Divider } from '@mui/material';

import { AnyPendingSubOp } from './types';
import AddToOrgConfig from './ops/AddToOrgConfig';
import SetFieldConfig from './ops/SetFieldConfig';
import ApplyTagConfig from './ops/ApplyTagConfig';

type Props = {
  onChange: (newOp: AnyPendingSubOp) => void;
  onDelete: () => void;
  pendingOp: AnyPendingSubOp;
};

const OpConfigRow: FC<Props> = ({ pendingOp, onChange, onDelete }) => {
  return (
    <Box>
      {pendingOp.opType == 'person.addtoorg' && (
        <AddToOrgConfig
          config={pendingOp.config}
          onChange={(config) => onChange({ ...pendingOp, config })}
          onDelete={onDelete}
        />
      )}
      {pendingOp.opType == 'person.setfields' && (
        <SetFieldConfig
          config={pendingOp.config}
          onChange={(config) => onChange({ ...pendingOp, config })}
          onDelete={onDelete}
        />
      )}
      {pendingOp.opType == 'person.tag' && (
        <ApplyTagConfig
          config={pendingOp.config}
          onChange={(config) => onChange({ ...pendingOp, config })}
          onDelete={onDelete}
        />
      )}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default OpConfigRow;
