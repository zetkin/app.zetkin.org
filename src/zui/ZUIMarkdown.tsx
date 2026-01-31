import { BoxProps } from '@mui/material';
import { marked } from 'marked';

import ZUICleanHtml from './ZUICleanHtml';

interface ZUIMarkdownProps {
  BoxProps?: BoxProps;
  markdown: string;
  forceTargetBlank?: boolean;
}

const ZUIMarkdown: React.FC<ZUIMarkdownProps> = ({
  BoxProps,
  markdown,
  forceTargetBlank,
}) => {
  const dirtyHtml = marked(markdown, { breaks: true });
  const targetBlankRef = forceTargetBlank
    ? (element: HTMLDivElement | null) => {
        if (element) {
          const aNodes = element.querySelectorAll('a');
          aNodes.forEach((node) => {
            node.setAttribute('target', '_blank');
          });
        }
      }
    : null;

  return (
    <ZUICleanHtml
      // passing targetBlankRef first allows overriding this behavior
      BoxProps={{ ref: targetBlankRef, ...BoxProps }}
      dirtyHtml={dirtyHtml}
    />
  );
};

export default ZUIMarkdown;
