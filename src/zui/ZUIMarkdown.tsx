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
  if (forceTargetBlank) {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(dirtyHtml, 'text/html');
    const aNodes = parsedHtml.querySelectorAll('a');
    aNodes.forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
    const serializer = new XMLSerializer();
    const dirtyNewTabHtml = serializer.serializeToString(parsedHtml);
    return (
      <ZUICleanHtml
        allowTargetBlank={true}
        BoxProps={BoxProps}
        dirtyHtml={dirtyNewTabHtml}
      />
    );
  }
  return <ZUICleanHtml BoxProps={BoxProps} dirtyHtml={dirtyHtml} />;
};

export default ZUIMarkdown;
