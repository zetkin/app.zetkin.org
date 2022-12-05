import { BoxProps } from '@mui/material';
import { marked } from 'marked';

import ZUICleanHtml from './ZUICleanHtml';

interface ZUIMarkdownProps {
  BoxProps?: BoxProps;
  markdown: string;
}

const ZUIMarkdown: React.FC<ZUIMarkdownProps> = ({ BoxProps, markdown }) => {
  const dirtyHtml = marked(markdown, { breaks: true });
  return <ZUICleanHtml BoxProps={BoxProps} dirtyHtml={dirtyHtml} />;
};

export default ZUIMarkdown;
