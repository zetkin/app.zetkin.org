import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import HouseholdColorPicker from '../../HouseholdColorPicker';
import { HouseholdColor } from 'features/canvass/types';

type HouseholdUpdate = { color?: string; level?: number };

type Props = {
  householdIds: number[];
  onBack: () => void;
  onSave: (updates: HouseholdUpdate) => void;
};

const BulkEditHouseholdsPage: FC<Props> = ({
  householdIds,
  onBack,
  onSave,
}) => {
  const messages = useMessages(messageIds);

  const [isLoading, setIsLoading] = useState(false);
  const [floor, setFloor] = useState<number | null>(null);
  const [color, setcolor] = useState<HouseholdColor | null>(null);

  useEffect(() => {
    setFloor(null);
    setcolor(null);
  }, [householdIds]);

  const nothingHasBeenEdited = !color && !floor;

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const updates: HouseholdUpdate = {
              color: color ?? undefined,
              level: floor ?? undefined,
            };
            await onSave(updates);
            setIsLoading(false);
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
        onSubmit={async (ev) => {
          ev.preventDefault();
          setIsLoading(true);
          const updates: HouseholdUpdate = {
            color: color ?? undefined,
            level: floor ?? undefined,
          };
          await onSave(updates);
          setIsLoading(false);
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
          <HouseholdColorPicker
            onChange={(newColor) => setcolor(newColor)}
            selectedColor={color}
          />
        </Box>
      </form>
    </PageBase>
  );
};

export default BulkEditHouseholdsPage;
