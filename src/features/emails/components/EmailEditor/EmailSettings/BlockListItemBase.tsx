import { Box, Collapse, Typography } from '@mui/material';
import { ExpandLess, ExpandMore, Warning } from '@mui/icons-material';
import { FC, ReactNode, useState } from 'react';

interface BlockListItemBaseProps {
  children?: ReactNode;
  excerpt: string;
  hasErrors: boolean;
  selected: boolean;
  title: string;
}

const BlockListItemBase: FC<BlockListItemBaseProps> = ({
  children,
  excerpt,
  hasErrors,
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
        paddingX={2}
        paddingY={1.5}
        sx={{ cursor: expandable ? 'pointer' : 'default' }}
      >
        <Box alignItems="center" display="flex" justifyContent="flex-start">
          {hasErrors && (
            <Warning color="warning" fontSize="small" sx={{ marginRight: 1 }} />
          )}
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
          width="60%"
        >
          <Typography
            color="secondary"
            maxWidth="80%"
            noWrap
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {excerpt}
          </Typography>
          {expandable && !expanded && <ExpandMore color="secondary" />}
          {expandable && expanded && <ExpandLess color="secondary" />}
        </Box>
      </Box>
      {expandable && (
        <Collapse in={expanded}>
          <Box paddingBottom={2} paddingX={1}>
            {children}
          </Box>
        </Collapse>
      )}
    </>
  );
};

export default BlockListItemBase;
