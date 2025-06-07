/* eslint-disable react/no-danger */
import DOMPurify from 'isomorphic-dompurify';
import { Box, BoxProps } from '@mui/material';
import { useMemo } from 'react';

interface ZUICleanHtmlProps {
  allowTargetBlank?: boolean;
  BoxProps?: BoxProps;
  dirtyHtml: string;
}

const ZUICleanHtml = ({
  allowTargetBlank = false,
  BoxProps,
  dirtyHtml,
}: ZUICleanHtmlProps): JSX.Element => {
  const cleanHtml = useMemo(
    () =>
      DOMPurify.sanitize(dirtyHtml, {
        ADD_ATTR: allowTargetBlank ? ['target', 'rel'] : [],
      }),
    [dirtyHtml]
  );
  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default ZUICleanHtml;
