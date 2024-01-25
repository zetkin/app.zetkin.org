import { Box, Collapse, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { FC, ReactNode, useState } from 'react';

interface BlockListItemBaseProps {
  children?: ReactNode;
  excerpt: string;
  selected: boolean;
  title: string;
}

const BlockListItemBase: FC<BlockListItemBaseProps> = ({
  children,
  excerpt,
  selected,
  title,
}) => {
  const expandable = !!children;
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        onClick={
          expandable && expanded
            ? () => setExpanded(false)
            : () => setExpanded(true)
        }
        padding={1}
        sx={{ cursor: expandable ? 'pointer' : 'default' }}
      >
        <Box alignItems="center" display="flex">
          <Typography
            fontWeight={selected ? 'bold' : 'normal'}
            sx={{ cursor: 'default', paddingRight: 1 }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          width="75%"
        >
          <Typography
            color="secondary"
            maxWidth="80%"
            noWrap
            overflow="hidden"
            textOverflow="ellipsis"
            variant="body2"
          >
            {excerpt}
          </Typography>
          {expandable && !expanded && <ExpandMore color="secondary" />}
          {expandable && expanded && <ExpandLess color="secondary" />}
        </Box>
      </Box>
      {expandable && (
        <Box paddingBottom={2} paddingX={1}>
          <Collapse in={expanded}>{children}</Collapse>
        </Box>
      )}
    </>
  );
};

export default BlockListItemBase;
