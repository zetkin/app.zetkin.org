import { BoxProps } from '@material-ui/core';
import { marked } from 'marked';

import CleanHtml from './CleanHtml';

interface MarkdownProps {
  BoxProps?: BoxProps;
  markdown: string;
}

const Markdown = ({ BoxProps, markdown }: MarkdownProps): JSX.Element => {
  const dirtyHtml = marked(markdown);
  return <CleanHtml BoxProps={BoxProps} dirtyHtml={dirtyHtml} />;
};

export default Markdown;
