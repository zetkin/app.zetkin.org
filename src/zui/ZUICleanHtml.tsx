/* eslint-disable react/no-danger */
'use client';

import DOMPurify from 'dompurify';
import { Box, BoxProps } from '@mui/material';
import { useEffect, useState } from 'react';

interface ZUICleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: BoxProps;
}

const ZUICleanHtml = ({
  BoxProps,
  dirtyHtml,
}: ZUICleanHtmlProps): JSX.Element => {
  const [cleanHtml, setCleanHtml] = useState('');

  useEffect(() => {
    setCleanHtml(DOMPurify.sanitize(dirtyHtml));
  }, [dirtyHtml]);

  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default ZUICleanHtml;
