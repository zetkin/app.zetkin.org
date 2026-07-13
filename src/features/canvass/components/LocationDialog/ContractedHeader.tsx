import { FC, Suspense } from 'react';
import { IconButton } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

import PageBaseHeader from './pages/PageBaseHeader';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import ContractedHeaderStats from './ContractedHeaderStats';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
};

const ContractedHeader: FC<Props> = ({ assignment, location }) => {
  return (
    <PageBaseHeader
      iconButtons={
        <IconButton>
          <KeyboardArrowUp />
        </IconButton>
      }
      subtitle={
        <Suspense>
          <ContractedHeaderStats assignment={assignment} location={location} />
        </Suspense>
      }
      title={location.title}
    />
  );
};

export default ContractedHeader;
