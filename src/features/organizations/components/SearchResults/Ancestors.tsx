import { ChevronRight } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { FC, useRef, useState } from 'react';

import messageIds from 'features/organizations/l10n/messageIds';
import { TreeItemData } from 'features/organizations/types';
import { useMessages } from 'core/i18n';
import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';

interface AncestorsProps {
  ancestors: TreeItemData[];
}

const Ancestors: FC<AncestorsProps> = ({ ancestors }) => {
  const messages = useMessages(messageIds);
  const originalCrumbWidths = useRef<number[] | null>(null);
  const [crumbStates, setCrumbStates] = useState<boolean[]>(
    ancestors.map(() => true)
  );

  return (
    <ZUIResponsiveContainer
      onWidthChange={(width, container) => {
        //Take all the elements that represent an ancestor in the "bread crumb trail"
        const childElements = Array.from(container.querySelectorAll('.crumb'));

        if (width == 0) {
          return;
        }

        //Save the original widhts of the crumb elements = how wide they are when they
        //show the full ancestor's title
        originalCrumbWidths.current = childElements.map((crumb, index) => {
          const oldWidth = originalCrumbWidths.current
            ? originalCrumbWidths.current[index]
            : 0;
          return Math.max(oldWidth, crumb.getBoundingClientRect().width);
        });

        let spaceLeft = Math.round(width);

        //Make an array of false values
        const nextCrumbStates: boolean[] = originalCrumbWidths.current.map(
          () => false
        );

        //Loop backwarrds through the original widhts of the crumbs,
        //to give priority to the ancestors closest to the child.
        //Set the value to true if the space left if displaying the
        //ancestor's title is more than 40 pixels.
        for (let i = originalCrumbWidths.current.length - 1; i >= 0; i--) {
          spaceLeft -= originalCrumbWidths.current[i];
          if (spaceLeft > 40) {
            nextCrumbStates[i] = true;
          }
        }

        //Save the array of true/false values in state.
        setCrumbStates(nextCrumbStates);
      }}
      ssrWidth={300}
    >
      {() => (
        <Box display="flex" flexWrap="wrap" width="100%">
          {ancestors.length === 0 && (
            <Box>
              <Typography color="secondary" variant="body2">
                {messages.sidebar.filter.topLevel()}
              </Typography>
            </Box>
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
