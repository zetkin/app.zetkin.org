import { Crop75, Image as ImageIcon, Notes, Title } from '@mui/icons-material';
import { FC } from 'react';

import {
  BlockKind,
  EmailContentBlock,
  EmailContentInlineNode,
  InlineNodeKind,
} from 'features/emails/types';
import BlockListItemBase from './BlockListItemBase';
import editorBlockProblems from 'zui/ZUIEditor/utils/editorBlockProblems';
import { useMessages } from 'core/i18n';
import emailMessageIds from 'features/emails/l10n/messageIds';
import editorMessageIds from 'zui/l10n/messageIds';

interface BlockListItemProps {
  block: EmailContentBlock;
}

const BlockListItem: FC<BlockListItemProps> = ({ block }) => {
  const emailMessages = useMessages(emailMessageIds);
  const editorMessages = useMessages(editorMessageIds.editor);

  const makeTitle = (nodes: EmailContentInlineNode[]): string => {
    let text = '';
    nodes.forEach((node) => {
      if (node.kind == InlineNodeKind.STRING) {
        text += node.value;
      } else if (node.kind == InlineNodeKind.VARIABLE) {
        text += emailMessages.editor.outline.variables[node.name]();
      } else if ('content' in node) {
        text += makeTitle(node.content);
      }
    });
    return text;
  };

  if (block.kind === BlockKind.PARAGRAPH) {
    const title = makeTitle(block.data.content);
    const hasErrors = editorBlockProblems(block);
    return (
      <BlockListItemBase
        hasErrors={hasErrors.length > 0}
        icon={Notes}
        title={title}
      />
    );
  } else if (block.kind === BlockKind.HEADER) {
    const title = makeTitle(block.data.content);
    return <BlockListItemBase hasErrors={false} icon={Title} title={title} />;
  } else if (block.kind === BlockKind.BUTTON) {
    const hasErrors = editorBlockProblems(
      block,
      editorMessages.extensions.button.defaultText()
    );
    return (
      <BlockListItemBase
        hasErrors={hasErrors.length > 0}
        icon={Crop75}
        title={block.data.text}
      />
    );
  } else {
    //Is image block
    return (
      <BlockListItemBase
        hasErrors={false}
        icon={ImageIcon}
        title={block.data.alt}
      />
    );
  }
};

export default BlockListItem;
