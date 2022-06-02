import { BoxProps } from '@material-ui/core';
import { marked } from 'marked';

import CleanHtml from './CleanHtml';

interface MarkdownProps {
  BoxProps?: BoxProps;
  markdown: string;
}

const Markdown: React.FC<MarkdownProps> = ({ BoxProps, markdown }) => {
  const dirtyHtml = marked(markdown);
  return <CleanHtml BoxProps={BoxProps} dirtyHtml={dirtyHtml} />;
};

export default Markdown;
