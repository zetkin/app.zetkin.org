import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';

import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagChip from '../TagChip';
import { ZetkinTag } from 'types/zetkin';

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
        ev.preventDefault();
        onSubmit();
      }}
    >
      <Box display="flex" flexDirection="column" p={1}>
        <Typography variant="body2">
          <FormattedMessage
            id="misc.tags.tagManager.valueTagForm.typeHint"
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
      <SubmitCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default ValueTagForm;
