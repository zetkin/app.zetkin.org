// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Element as SlateElement } from 'slate';
import React, { HTMLAttributes } from 'react';

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

const LinkComponent: React.FunctionComponent<{
  attributes: HTMLAttributes<HTMLAnchorElement>;
  children: React.ReactNode;
  element: unknown;
}> = ({ attributes, children, element }) => {
  return (
    <a {...attributes} href={(element as SlateElement & { url: string }).url}>
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

export default LinkComponent;
