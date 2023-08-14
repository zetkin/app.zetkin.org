import { ChevronRight } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { FC, useRef, useState } from 'react';

import { TreeItemData } from 'features/organizations/types';
import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';

interface AncestorsProps {
  ancestors: TreeItemData[];
}

const Ancestors: FC<AncestorsProps> = ({ ancestors }) => {
  const originalCrumbWidths = useRef<number[] | null>(null);
  const [crumbStates, setCrumbStates] = useState<boolean[]>(
    ancestors.map(() => true)
  );

  return (
    <ZUIResponsiveContainer
      onWidthChange={(width, container) => {
        const childElements = Array.from(container.querySelectorAll('.crumb'));

        if (width == 0) {
          return;
        }

        originalCrumbWidths.current = childElements.map((crumb, index) => {
          const oldWidth = originalCrumbWidths.current
            ? originalCrumbWidths.current[index]
            : 0;
          return Math.max(oldWidth, crumb.getBoundingClientRect().width);
        });

        let spaceLeft = Math.round(width);
        const nextCrumbStates: boolean[] = originalCrumbWidths.current.map(
          () => false
        );

        for (let i = originalCrumbWidths.current.length - 1; i >= 0; i--) {
          spaceLeft -= originalCrumbWidths.current[i];
          if (spaceLeft > 40) {
            nextCrumbStates[i] = true;
          }
        }

        setCrumbStates(nextCrumbStates);
      }}
      ssrWidth={300}
    >
      {() => (
        <Box display="flex" flexWrap="wrap" width="100%">
          {ancestors.length === 0 && (
            <Typography color="secondary" variant="body2">
              Top level organization
            </Typography>
          )}
          {ancestors.map((ancestor, index) => {
            return (
              <Box
                key={`ancestor-${ancestor.id}`}
                className="crumb"
                display="flex"
                flexShrink={0}
              >
                <Typography
                  color="secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="body2"
                >
                  {crumbStates[index] ? ancestor.title : '...'}
                </Typography>
                {index == ancestors.length - 1 ? (
                  ''
                ) : (
                  <ChevronRight color="secondary" fontSize="small" />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </ZUIResponsiveContainer>
  );
};

export default Ancestors;
