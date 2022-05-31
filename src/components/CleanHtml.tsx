import dompurify from 'dompurify';
import { Box, BoxProps } from '@material-ui/core';

interface CleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: BoxProps;
}

const CleanHtml = ({ BoxProps, dirtyHtml }: CleanHtmlProps): JSX.Element => {
  const cleanHtml = dompurify.sanitize(dirtyHtml);
  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default CleanHtml;
