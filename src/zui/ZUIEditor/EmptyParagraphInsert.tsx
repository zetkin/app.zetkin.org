import { useCommands, useRemirrorContext } from '@remirror/react';
import { FC, useEffect, useState } from 'react';

import { EmailContentBlock } from 'features/emails/types';

export const EmptyParagraphInsert: FC<{
  content: EmailContentBlock[];
  forceRerender: () => void;
}> = ({ content, forceRerender }) => {
  const { insertEmptyParagraph, focus } = useCommands();
  const { view } = useRemirrorContext();

  const [hasInserted, setHasInserted] = useState(false);

  useEffect(() => {
    if (hasInserted) {
      return;
    }

    setHasInserted(true);

    if (content.length !== 0) {
      return;
    }

    insertEmptyParagraph(0);
    requestAnimationFrame(() => {
      focus(0);
      forceRerender();
    });
  }, [hasInserted, content, insertEmptyParagraph, focus, view, forceRerender]);

  return null;
};
