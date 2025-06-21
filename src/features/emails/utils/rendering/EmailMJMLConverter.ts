/* eslint-disable sort-keys */
import { MJMLJsonObject } from 'mjml-core';

import insertAtPlaceholder from './insertAtPlaceholder';
import {
  EmailContent,
  EmailContentInlineNode,
  EmailTheme,
} from 'features/emails/types';

export default class EmailMJMLConverter {
  convertContentToMjml(
    content: EmailContent,
    frame: EmailTheme | null
  ): MJMLJsonObject {
    const blockChildren: MJMLJsonObject[] = [];

    content.blocks.forEach((block) => {
      if (block.kind == 'image') {
        blockChildren.push({
          tagName: 'mj-image',
          attributes: {
            ...frame?.block_attributes?.image,
            alt: block.data.alt,
            src: block.data.src,
          },
        });
      } else if (block.kind == 'paragraph') {
        const contentHtml = inlineNodesToPlainHTML(block.data.content);

        blockChildren.push({
          tagName: 'mj-text',
          attributes: {},
          content: `<p>${contentHtml}</p>`,
        });
      } else if (block.kind == 'button') {
        let href = escapeAttribute(block.data.href);
        if (href.match(/^https?:\/\/.*/) == null) {
          href = '';
        }

        blockChildren.push({
          tagName: 'mj-button',
          attributes: {
            ...frame?.block_attributes?.button,
            'css-class': `email-link-${block.data.tag}`,
            href: href,
          },
          content: block.data.text,
        });
      } else if (block.kind == 'header') {
        if (typeof block.data.level != 'number') {
          block.data.level = 1;
        }

        const tagName = 'h' + block.data.level;
        const contentHtml = inlineNodesToPlainHTML(block.data.content);
        blockChildren.push({
          tagName: 'mj-text',
          attributes: {},
          content: `<${tagName}>${contentHtml}</${tagName}>`,
        });
      }
    });

    const frameMjml = frame?.frame_mjml ?? {
      tagName: 'mj-section',
      attributes: {},
      children: [
        {
          tagName: 'mj-column',
          attributes: {},
          children: [
            {
              tagName: 'placeholder',
            },
          ],
        },
      ],
    };

    const wrappedChildren = insertAtPlaceholder(frameMjml, blockChildren);

    const headChildren: MJMLJsonObject[] = [];
    if (frame?.css && frame.css.length > 0) {
      headChildren.push({
        tagName: 'mj-style',
        attributes: {},
        content: frame.css,
      });
    }

    return {
      tagName: 'mjml',
      attributes: {},
      children: [
        {
          tagName: 'mj-head',
          attributes: {},
          children: headChildren,
        },
        {
          tagName: 'mj-body',
          attributes: {},
          children: wrappedChildren,
        },
      ],
    };
  }
}

function inlineNodesToPlainHTML(nodes: EmailContentInlineNode[]): string {
  let output = '';

  nodes.forEach((node) => {
    if (node.kind == 'string') {
      output += escapeHTMLContent(node.value);
    } else if (node.kind == 'bold') {
      const htmlContent = inlineNodesToPlainHTML(node.content);
      output += `<b>${htmlContent}</b>`;
    } else if (node.kind == 'italic') {
      const htmlContent = inlineNodesToPlainHTML(node.content);
      output += `<i>${htmlContent}</i>`;
    } else if (node.kind == 'link') {
      let href = escapeAttribute(node.href);
      if (href.match(/^https?:\/\/.*/) == null) {
        href = '';
      }
      const htmlContent = inlineNodesToPlainHTML(node.content);
      const tag = escapeAttribute(node.tag);
      output += `<a class="email-link-${tag}" href="${href}">${htmlContent}</a>`;
    } else if (node.kind == 'lineBreak') {
      output += '<br>';
    }
  });

  return output;
}

function escapeHTMLContent(content: string): string {
  return content
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value: string): string {
  return value.replaceAll('"', '%22').replaceAll("'", '%27');
}
