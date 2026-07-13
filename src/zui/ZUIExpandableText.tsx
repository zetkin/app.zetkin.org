import { MouseEvent, useState } from 'react';
import { Box, Link, Typography } from '@mui/material';

import messageIds from './l10n/messageIds';
import { useMessages } from 'core/i18n';

interface ZUIExpandableTextProps {
  content: string;
  maxVisibleChars: number;
  color?: string;
  fontStyle?: string;
}

export const ZUIExpandableText: React.FC<ZUIExpandableTextProps> = ({
  content,
  maxVisibleChars,
  color,
  fontStyle,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const messages = useMessages(messageIds);

  const handleToggle = (event: MouseEvent) => {
    event.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const displayedText = isExpanded
    ? content
    : content.slice(0, maxVisibleChars);

  const isLongContent = content.length > maxVisibleChars;
  return (
    <Box sx={{ display: 'inline' }}>
      <Typography
        color={color}
        component="span"
        fontStyle={fontStyle}
        sx={{
          display: 'inline',
          verticalAlign: 'baseline',
          whiteSpace: 'break-spaces',
        }}
        variant="body1"
      >
        <Typography
          component="span"
          sx={{
            mr: 1,
          }}
        >
          {displayedText}
          {isLongContent && !isExpanded && <span>...</span>}
        </Typography>
        {isLongContent && (
          <Link
            component="button"
            onClick={handleToggle}
            sx={{
              cursor: 'pointer',
              display: 'inline',
              padding: 0,
              textDecoration: 'underline',
              verticalAlign: 'text-bottom',
            }}
            variant="body1"
          >
            {isExpanded
              ? messages.expandableText.showLess()
              : messages.expandableText.showMore()}
          </Link>
        )}
      </Typography>
    </Box>
  );
};
