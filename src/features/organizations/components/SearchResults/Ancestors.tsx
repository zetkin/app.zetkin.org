import { ChevronRight } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { TreeItemData } from 'features/organizations/types';

const Dots = () => {
  return (
    <>
      <Typography color="secondary" variant="body2">
        ...
      </Typography>
      <ChevronRight color="secondary" fontSize="small" />
    </>
  );
};

const Title = ({ title }: { title: string }) => {
  return (
    <>
      <Typography color="secondary" variant="body2">
        {title}
      </Typography>
      <ChevronRight color="secondary" fontSize="small" />
    </>
  );
};

const renderAncestors = (ancestors: TreeItemData[]) => {
  if (ancestors.length === 0) {
    return;
  }

  if (ancestors.length === 1) {
    return <Title title={ancestors[0].title} />;
  }

  if (ancestors.length === 2) {
    return (
      <>
        {ancestors.map((ancestor) => {
          return ancestor.title.length > 10 ? (
            <Dots />
          ) : (
            <Title title={ancestor.title} />
          );
        })}
      </>
    );
  }

  if (ancestors.length > 2) {
    const closestTwo = ancestors.slice(-2);
    return (
      <>
        <Dots />
        {closestTwo.map((ancestor) => {
          return ancestor.title.length > 10 ? (
            <Dots />
          ) : (
            <Title title={ancestor.title} />
          );
        })}
      </>
    );
  }
};

interface AncestorsProps {
  ancestors: TreeItemData[];
}

const Ancestors: FC<AncestorsProps> = ({ ancestors }) => {
  return <Box display="flex">{renderAncestors(ancestors)}</Box>;
};

export default Ancestors;
