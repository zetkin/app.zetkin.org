'use client';

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
  forceTargetBlank = true,
}) => {
  const renderer = new marked.Renderer();
  const baseLinkRenderer = renderer.link.bind(renderer);

  renderer.link = (href, title, text) => {
    const html = baseLinkRenderer(href, title, text);

    if (!forceTargetBlank) {
      return html;
    }

    return html.replace(
      /^<a /,
      '<a target="_blank" rel="noopener noreferrer" '
    );
  };

  const dirtyHtml = marked(markdown, { breaks: true, renderer });

  return <ZUICleanHtml BoxProps={BoxProps} dirtyHtml={dirtyHtml} />;
};

export default ZUIMarkdown;
