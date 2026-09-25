/* eslint-disable react/no-danger */
'use client';

import DOMPurify from 'dompurify';
import { Box, BoxProps, Skeleton } from '@mui/material';
import { useEffect, useState, type JSX } from 'react';

interface ZUICleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: BoxProps;
}

const ZUICleanHtml = ({
  BoxProps,
  dirtyHtml,
}: ZUICleanHtmlProps): JSX.Element => {
  const [cleanHtml, setCleanHtml] = useState<string | null>(null);

  useEffect(() => {
    setCleanHtml(DOMPurify.sanitize(dirtyHtml));
  }, [dirtyHtml]);

  if (cleanHtml === null) {
    return (
      <Box {...BoxProps}>
        <Skeleton width="100%" />
        <Skeleton width="100%" />
        <Skeleton width="60%" />
      </Box>
    );
  }

  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default ZUICleanHtml;
