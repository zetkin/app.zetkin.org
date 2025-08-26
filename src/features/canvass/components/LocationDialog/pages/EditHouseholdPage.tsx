import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import useHousehold from 'features/canvass/hooks/useHousehold';
import { ZetkinLocation } from 'features/areaAssignments/types';
import HouseholdColorPicker from '../../HouseholdColorPicker';

type Props = {
  householdId: number;
  location: ZetkinLocation;
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string, level: number, color: string) => void;
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
  const [color, setcolor] = useState(household.color);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle(household.title || '');
    setFloor(household.level ?? 0);
    setcolor(household.color);
  }, [household]);

  const nothingHasBeenEdited =
    title == household.title &&
    floor == household.level &&
    color == household.color;

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited || title.length === 0}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await onSave(title, floor || 0, color);
            setIsLoading(false);
          }}
          variant="contained"
        >
          <Msg id={messageIds.households.editSingleHousehold.saveButtonLabel} />
        </Button>
      }
      color={household.color}
      onBack={onBack}
      onClose={onClose}
      subtitle={
        household.level
          ? messages.households.single.subtitle({
              floorNumber: household.level,
            })
          : messages.default.floor()
      }
      title={messages.households.editSingleHousehold.header({
        title: household.title,
      })}
    >
      <form
        onSubmit={async (ev) => {
          setIsLoading(true);
          ev.preventDefault();
          await onSave(title, floor, color);
          setIsLoading(false);
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label={messages.households.editSingleHousehold.titleLabel()}
            onChange={(ev) => setTitle(ev.target.value)}
            value={title}
          />
          <TextField
            fullWidth
            label={messages.households.editSingleHousehold.floorLabel()}
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

export default EditHouseholdPage;
