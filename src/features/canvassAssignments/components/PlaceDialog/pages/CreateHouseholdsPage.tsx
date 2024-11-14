import { range } from 'lodash';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { Add, DoorFrontOutlined, Remove } from '@mui/icons-material';

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
  const [numFloors, setNumFloors] = useState(2);
  const [numAptsPerFloor, setNumAptsPerFloor] = useState(3);
  const [creating, setCreating] = useState(false);
  const { addHouseholds } = usePlaceMutations(orgId, placeId);

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

            await addHouseholds(
              range(numFloors).flatMap((floorIndex) =>
                range(numAptsPerFloor).map((aptIndex) => ({
                  floor: floorIndex + 1,
                  title: 'Household ' + (aptIndex + 1),
                }))
              )
            );

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
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        height="100%"
        justifyContent="stretch"
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          flexGrow={1}
          justifyContent="end"
        >
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
        <Box display="flex" justifyContent="space-around">
          <Stepper
            label="Number of floors"
            onChange={(value) => setNumFloors(value)}
            value={numFloors}
          />
          <Stepper
            label="Households per floor"
            onChange={(value) => setNumAptsPerFloor(value)}
            value={numAptsPerFloor}
          />
        </Box>
      </Box>
    </PageBase>
  );
};

const Stepper: FC<{
  label: string;
  onChange: (value: number) => void;
  value: number;
}> = ({ label, onChange, value }) => {
  return (
    <Box alignItems="center" display="flex" flexDirection="column">
      <Typography color="secondary">{label}</Typography>
      <Box alignItems="center" display="flex">
        <IconButton onClick={() => onChange(value - 1)}>
          <Remove />
        </IconButton>
        <Typography minWidth={40} textAlign="center">
          {value}
        </Typography>
        <IconButton onClick={() => onChange(value + 1)}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CreateHouseholdsPage;
