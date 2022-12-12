/* eslint-disable react/no-danger */
import DOMPurify from 'isomorphic-dompurify';
import { Box, BoxProps } from '@mui/material';

interface ZUICleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: BoxProps;
}

const ZUICleanHtml = ({
  BoxProps,
  dirtyHtml,
}: ZUICleanHtmlProps): JSX.Element => {
  const cleanHtml = DOMPurify.sanitize(dirtyHtml);
  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default ZUICleanHtml;
