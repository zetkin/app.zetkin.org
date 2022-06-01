/* eslint-disable react/no-danger */
import DOMPurify from 'isomorphic-dompurify';
import { Box, BoxProps } from '@material-ui/core';

interface CleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: BoxProps;
}

const CleanHtml = ({ BoxProps, dirtyHtml }: CleanHtmlProps): JSX.Element => {
  const cleanHtml = DOMPurify.sanitize(dirtyHtml);
  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default CleanHtml;
