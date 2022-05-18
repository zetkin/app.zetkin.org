import { Property } from 'csstype';
import React, { Attributes } from 'react';

import LinkComponent from './LinkComponent';

const TextElement: React.FunctionComponent<{
  attributes: Attributes;
  element: { align: Property.TextAlign; [key: string]: string };
}> = ({ attributes, children, element }) => {
  const style = {
    margin: '0 0 12px 0',
    textAlign: element.align,
  };
  if (element.type === 'block-quote') {
    return (
      <blockquote style={style} {...attributes}>
        {children}
      </blockquote>
    );
  }
  if (element.type === 'bulleted-list') {
    return (
      <ul style={style} {...attributes}>
        {children}{' '}
      </ul>
    );
  }
  if (element.type === 'heading-one') {
    return (
      <h1 style={style} {...attributes}>
        {children}
      </h1>
    );
  }
  if (element.type === 'heading-two') {
    return (
      <h2 style={style} {...attributes}>
        {children}
      </h2>
    );
  }
  if (element.type === 'list-item') {
    return (
      <li style={style} {...attributes}>
        {children}
      </li>
    );
  }
  if (element.type === 'numbered-list') {
    return (
      <ol style={style} {...attributes}>
        {children}
      </ol>
    );
  }
  if (element.type === 'link') {
    return <LinkComponent {...{ attributes, children, element }} />;
  } else {
    return (
      <p style={style} {...attributes}>
        {children}
      </p>
    );
  }
};

export default TextElement;
