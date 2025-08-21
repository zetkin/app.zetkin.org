import { Box, Button, Input, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type Props = {
  householdIds: number[];
  onBack: () => void;
  onSave: (updates: { colorCode?: string | null; floor?: number }) => void;
};

const BulkEditHouseholdsPage: FC<Props> = ({
  householdIds,
  onBack,
  onSave,
}) => {
  const messages = useMessages(messageIds);

  const [floor, setFloor] = useState<number | null>(null);
  const [colorCode, setColorCode] = useState<string | null>(null);

  useEffect(() => {
    setFloor(null);
    setColorCode(null);
  }, []);

  const nothingHasBeenEdited = floor == null && colorCode == null;

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited}
          onClick={() => {
            const updates = {
              colorCode,
              floor: floor ?? undefined,
            };
            onSave(updates);
          }}
          variant="contained"
        >
          <Msg
            id={messageIds.households.bulkEditHouseholds.saveButtonLabel}
            values={{ numHouseholds: householdIds.length }}
          />
        </Button>
      }
      onBack={onBack}
      title={messages.households.bulkEditHouseholds.header({
        numHouseholds: householdIds.length,
      })}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          const updates = {
            colorCode,
            floor: floor ?? undefined,
          };
          onSave(updates);
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label={messages.households.bulkEditHouseholds.floorLabel()}
            onChange={(ev) => setFloor(parseInt(ev.target.value))}
            type="number"
            value={floor}
          />
          <Input
            onChange={(ev) => setColorCode(ev.target.value)}
            type="color"
            value={colorCode}
          />
        </Box>
      </form>
    </PageBase>
  );
};

export default BulkEditHouseholdsPage;
