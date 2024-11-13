import { range } from 'lodash';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { DoorFrontOutlined } from '@mui/icons-material';

import PageBase from './PageBase';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';

type Props = {
  onBack: () => void;
  onClose: () => void;
  orgId: number;
  placeId: string;
};

const CreateHouseholdsPage: FC<Props> = ({
  onBack,
  onClose,
  orgId,
  placeId,
}) => {
  const [numFloors, setNumFloors] = useState(1);
  const [numAptsPerFloor, setNumAptsPerFloor] = useState(1);
  const [creating, setCreating] = useState(false);
  const { addHousehold } = usePlaceMutations(orgId, placeId);

  const numTotal =
    numFloors > 0 && numAptsPerFloor > 0 ? numFloors * numAptsPerFloor : 0;

  const isEmpty = numTotal <= 0;

  return (
    <PageBase
      actions={
        <Button
          disabled={isEmpty || creating}
          onClick={async () => {
            setCreating(true);
            const indices = range(numTotal);
            await Promise.all(indices.map(() => addHousehold()));

            setCreating(false);
            onBack();
          }}
          startIcon={
            creating ? <CircularProgress color="secondary" size="20px" /> : null
          }
          variant="contained"
        >
          Create {numTotal} households
        </Button>
      }
      onBack={onBack}
      onClose={onClose}
      title="Create households"
    >
      <TextField
        label="Floor count"
        onChange={(ev) => setNumFloors(parseInt(ev.target.value))}
        type="number"
        value={numFloors}
      />
      <TextField
        label="Households per floor"
        onChange={(ev) => setNumAptsPerFloor(parseInt(ev.target.value))}
        type="number"
        value={numAptsPerFloor}
      />
      <Box alignItems="center" display="flex" flexDirection="column" my={2}>
        {!isEmpty && (
          <Box display="flex" flexDirection="column" gap={1} p={1}>
            {range(0, numFloors).map((floor) => {
              return (
                <Box
                  key={floor}
                  borderBottom="2px solid black"
                  display="flex"
                  gap={1}
                >
                  {range(0, numAptsPerFloor).map((apt) => {
                    return (
                      <Box
                        key={apt}
                        bottom="-12px"
                        flexGrow={1}
                        flexShrink={1}
                        position="relative"
                      >
                        <DoorFrontOutlined />
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </PageBase>
  );
};

export default CreateHouseholdsPage;
