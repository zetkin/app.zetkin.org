import { Box, Slide } from '@mui/material';
import { FC, ReactElement } from 'react';

type Props = {
  bgcolor?: string;
  children: ReactElement[];
  currentPage: string;
};

const ZUINavStack: FC<Props> = ({ bgcolor, children, currentPage }) => {
  const childKeys = children.map((child) => child.key?.toString() ?? null);
  if (childKeys.includes(null)) {
    throw new Error('All children of ZUINavStack must have keys');
  }

  const selectedIndex = childKeys.indexOf(currentPage);
  if (selectedIndex < 0) {
    throw new Error(
      `Trying to navigate ZUINavStack to unknown page '${currentPage}'`
    );
  }

  return (
    <Box sx={{ height: '100%', position: 'relative', width: '100%' }}>
      {children.map((child, index) => {
        return (
          <Slide
            key={child.key}
            appear={false}
            direction="left"
            in={index <= selectedIndex}
          >
            <Box
              sx={{
                bgcolor: bgcolor,
                bottom: 0,
                left: 0,
                position: 'absolute',
                right: 0,
                top: 0,
                zIndex: index,
              }}
            >
              {child}
            </Box>
          </Slide>
        );
      })}
    </Box>
  );
};

export default ZUINavStack;
