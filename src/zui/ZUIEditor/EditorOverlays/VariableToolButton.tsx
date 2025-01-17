import { IconButton, Menu, MenuItem } from '@mui/material';
import { FC, useState } from 'react';
import { DataObject } from '@mui/icons-material';

import { VariableName } from '../extensions/VariableExtension';
import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  onSelect: (varName: VariableName) => void;
};

const VariableToolButton: FC<Props> = ({ onSelect }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSelect = (varName: VariableName) => {
    onSelect(varName);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={(ev) => {
          setAnchorEl(ev.currentTarget);
        }}
      >
        <DataObject />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        open={!!anchorEl}
        sx={{ zIndex: 99999 }}
      >
        <MenuItem onClick={() => handleSelect('first_name')}>
          <Msg id={messageIds.editor.variables.firstName} />
        </MenuItem>
        <MenuItem onClick={() => handleSelect('last_name')}>
          <Msg id={messageIds.editor.variables.lastName} />
        </MenuItem>
        <MenuItem onClick={() => handleSelect('full_name')}>
          <Msg id={messageIds.editor.variables.fullName} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default VariableToolButton;
