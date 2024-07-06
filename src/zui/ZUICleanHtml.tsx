/* eslint-disable react/no-danger */
import DOMPurify from 'isomorphic-dompurify';
import { Box, BoxProps } from '@mui/material';
import { useMemo } from 'react';

interface ZUICleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: BoxProps;
}

const ZUICleanHtml = ({
  BoxProps,
  dirtyHtml,
}: ZUICleanHtmlProps): JSX.Element => {
  const cleanHtml = useMemo(() => DOMPurify.sanitize(dirtyHtml), [dirtyHtml]);
  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default ZUICleanHtml;
