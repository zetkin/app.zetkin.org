import { Button, Menu, MenuItem } from '@mui/material';
import { FC, useState } from 'react';
import { DataObject } from '@mui/icons-material';
import { useCommands } from '@remirror/react';

import { VariableName } from '../../../extensions/VariableExtension';
import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

const VariableToolButton: FC = () => {
  const { insertVariable } = useCommands();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSelect = (varName: VariableName) => {
    insertVariable(varName);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={(ev) => {
          setAnchorEl(ev.currentTarget);
        }}
      >
        <DataObject />
      </Button>
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
