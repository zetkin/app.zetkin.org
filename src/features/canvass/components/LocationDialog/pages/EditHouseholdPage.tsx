import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { Household } from 'features/areaAssignments/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type Props = {
  household: Household;
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string, floor: number | null) => void;
};

const EditHouseholdPage: FC<Props> = ({
  onClose,
  onBack,
  onSave,
  household,
}) => {
  const messages = useMessages(messageIds);

  const [title, setTitle] = useState(household.title || '');
  const [floor, setFloor] = useState(household.floor ?? NaN);

  useEffect(() => {
    setTitle(household.title || '');
    setFloor(household.floor ?? NaN);
  }, [household]);

  const nothingHasBeenEdited =
    title == household.title && floor == household.floor;

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited}
          onClick={() => {
            onSave(title, floor || null);
          }}
          variant="contained"
        >
          <Msg id={messageIds.households.edit.saveButtonLabel} />
        </Button>
      }
      onBack={onBack}
      onClose={onClose}
      title={messages.households.edit.header({
        title: household.title || messages.default.household(),
      })}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSave(title, floor || null);
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label={messages.households.edit.titleLabel()}
            onChange={(ev) => setTitle(ev.target.value)}
            value={title}
          />
          <TextField
            fullWidth
            label={messages.households.edit.floorLabel()}
            onChange={(ev) => setFloor(parseInt(ev.target.value))}
            type="number"
            value={floor}
          />
        </Box>
      </form>
    </PageBase>
  );
};

export default EditHouseholdPage;
