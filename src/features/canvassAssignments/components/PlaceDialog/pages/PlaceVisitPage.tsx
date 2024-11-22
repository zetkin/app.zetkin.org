import { FC, useState } from 'react';
import { Box, Button } from '@mui/material';

import PageBase from './PageBase';
import Stepper from '../Stepper';

type Props = {
  onBack: () => void;
  onClose: () => void;
};

const PlaceVisitPage: FC<Props> = ({ onBack, onClose }) => {
  const [numHouseholds, setNumHouseholds] = useState(0);
  const [numVisited, setNumVisited] = useState(0);
  const [numSuccesful, setNumSuccessful] = useState(0);

  return (
    <PageBase
      actions={<Button variant="contained">Submit</Button>}
      onBack={onBack}
      onClose={onClose}
      title="Report visits here"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={4}
        height="100%"
        justifyContent="center"
      >
        <Stepper
          label="Total number of households"
          onChange={(value) => setNumHouseholds(value)}
          value={numHouseholds}
        />
        <Stepper
          label="Households visited"
          onChange={(value) => setNumVisited(value)}
          value={numVisited}
        />
        <Stepper
          label="Successful visits"
          onChange={(value) => setNumSuccessful(value)}
          value={numSuccesful}
        />
      </Box>
    </PageBase>
  );
};

export default PlaceVisitPage;
