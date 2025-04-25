import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import useHousehold from 'features/canvass/hooks/useHousehold';
import { ZetkinLocation } from 'features/areaAssignments/types';

type Props = {
  householdId: number;
  location: ZetkinLocation;
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string, level: number) => void;
};

const EditHouseholdPage: FC<Props> = ({
  householdId,
  location,
  onClose,
  onBack,
  onSave,
}) => {
  const messages = useMessages(messageIds);
  const household = useHousehold(
    location.organization_id,
    location.id,
    householdId
  );

  const [title, setTitle] = useState(household.title || '');
  const [floor, setFloor] = useState(household.level ?? 0);

  useEffect(() => {
    setTitle(household.title || '');
    setFloor(household.level ?? 0);
  }, [household]);

  const nothingHasBeenEdited =
    title == household.title && floor == household.level;

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited || title.length === 0}
          onClick={() => {
            onSave(title, floor || 0);
          }}
          variant="contained"
        >
          <Msg id={messageIds.households.edit.saveButtonLabel} />
        </Button>
      }
      onBack={onBack}
      onClose={onClose}
      title={messages.households.edit.header({
        title: household.title,
      })}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSave(title, floor);
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
