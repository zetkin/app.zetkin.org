import DOMPurify from 'dompurify';
import { Box, Collapse, Typography, useTheme } from '@mui/material';
import { ExpandLess, ExpandMore, Warning } from '@mui/icons-material';
import { FC, ReactNode, useState } from 'react';

interface BlockListItemBaseProps {
  children?: ReactNode;
  excerpt: string;
  hasErrors: boolean;
  readOnly?: boolean;
  selected: boolean;
  title: string;
}

const BlockListItemBase: FC<BlockListItemBaseProps> = ({
  children,
  excerpt,
  hasErrors,
  readOnly = false,
  selected,
  title,
}) => {
  const theme = useTheme();
  const expandable = !!children;
  const [expanded, setExpanded] = useState(true);

  const excerptWithoutHtml = DOMPurify.sanitize(excerpt, {
    ALLOWED_TAGS: [],
  });
  const excerptWithoutHtmlEntities = excerptWithoutHtml.replace(
    /&[#a-zA-Z0-9]+;/g,
    ''
  );

  const showExpandMore = expandable && !expanded && !readOnly;
  const showExpandLess = expandable && expanded && !readOnly;
  const showChildren = expandable && !readOnly;

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
        paddingX={1.5}
        paddingY={1.5}
        sx={{
          borderLeft: selected
            ? `3px solid ${theme.palette.primary.main}`
            : '3px solid transparent',
          cursor: expandable ? 'pointer' : 'default',
        }}
      >
        <Box alignItems="center" display="flex" justifyContent="flex-start">
          {hasErrors && (
            <Warning color="warning" fontSize="small" sx={{ marginRight: 1 }} />
          )}
          <Typography sx={{ cursor: 'default', paddingRight: 1 }}>
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
            {excerptWithoutHtmlEntities}
          </Typography>
          {showExpandMore && <ExpandMore color="secondary" />}
          {showExpandLess && <ExpandLess color="secondary" />}
        </Box>
      </Box>
      {showChildren && (
        <Collapse in={expanded}>
          <Box
            paddingBottom={2}
            paddingX={2}
            sx={{
              borderLeft: selected
                ? `3px solid ${theme.palette.primary.main}`
                : '3px solid transparent',
            }}
          >
            {children}
          </Box>
        </Collapse>
      )}
    </>
  );
};

export default BlockListItemBase;
