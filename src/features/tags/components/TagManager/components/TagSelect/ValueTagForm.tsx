import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import TagChip from '../TagChip';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

import messageIds from '../../../../l10n/messageIds';
import Msg from 'core/i18n/Msg';

const ValueTagForm: React.FC<{
  inputValue: string;
  onCancel: () => void;
  onChange: (value: string | number | null) => void;
  onSubmit: () => void;
  tag: ZetkinTag;
}> = ({ inputValue, onCancel, onChange, onSubmit, tag }) => {
  useEffect(() => {
    if (inputValue == '') {
      onChange(null);
    } else {
      onChange(inputValue);
    }
  }, [inputValue]);

  return (
    <form
      onSubmit={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        onSubmit();
      }}
    >
      <Box display="flex" flexDirection="column" p={1}>
        <Typography variant="body2">
          <Msg
            id={messageIds.manager.valueTagForm.typeHint}
            values={{ type: tag.value_type }}
          />
        </Typography>
        <Box
          alignItems="flex-start"
          display="flex"
          flexDirection="column"
          marginTop={1}
        >
          <TagChip tag={{ ...tag, value: inputValue }} />
        </Box>
      </Box>
      <ZUISubmitCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default ValueTagForm;
