import EditorJS from '@editorjs/editorjs';
import { ExpandMore } from '@mui/icons-material';
import { OutputBlockData } from '@editorjs/editorjs';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { FC, MutableRefObject } from 'react';

import { ButtonData } from '../tools/Button';
import ButtonSettings from '../tools/Button/ButtonSettings';

interface BlockListProps {
  apiRef: MutableRefObject<EditorJS | null>;
  blocks: OutputBlockData[];
  selectedBlockIndex: number;
}

const BlockList: FC<BlockListProps> = ({
  apiRef,
  blocks,
  selectedBlockIndex,
}) => {
  const currentBlock = blocks[selectedBlockIndex];
  return (
    <>
      {blocks.map((block, index) => {
        const expanded = index === selectedBlockIndex;
        return (
          <Accordion key={block.id} disableGutters expanded={expanded}>
            <AccordionSummary expandIcon={<ExpandMore color="secondary" />}>
              {block.type}
            </AccordionSummary>
            <AccordionDetails>
              {block.type == 'button' && (
                <ButtonSettings
                  onChange={(newUrl: ButtonData['url']) => {
                    if (currentBlock.id) {
                      apiRef.current?.blocks.update(currentBlock.id, {
                        ...currentBlock.data,
                        url: newUrl,
                      });
                    }
                  }}
                  url={currentBlock.data.url || ''}
                />
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

export default BlockList;
