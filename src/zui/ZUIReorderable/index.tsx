import { Box } from '@mui/material';
import { FC } from 'react';
import UpDownArrows from './UpDownArrows';

type IDType = number | string;

type ReorderableItem = {
  id: IDType;
  renderContent: () => JSX.Element;
};

type ZUIReorderableProps = {
  items: ReorderableItem[];
  onReorder: (ids: IDType[]) => void;
};

const ZUIReorderable: FC<ZUIReorderableProps> = ({ items, onReorder }) => {
  return (
    <Box>
      {items.map((item, index) => {
        return (
          <Box key={item.id} display="flex">
            <Box>
              <UpDownArrows
                onClickDown={() => {
                  if (index + 1 < items.length) {
                    const ids = items.map((item) => item.id);
                    const current = ids[index];
                    ids[index] = ids[index + 1];
                    ids[index + 1] = current;

                    onReorder(ids);
                  }
                }}
                onClickUp={() => {
                  if (index > 0) {
                    const ids = items.map((item) => item.id);
                    const current = ids[index];
                    ids[index] = ids[index - 1];
                    ids[index - 1] = current;

                    onReorder(ids);
                  }
                }}
                showDown={index < items.length - 1}
                showUp={index > 0}
              />
            </Box>
            {item.renderContent()}
          </Box>
        );
      })}
    </Box>
  );
};

export default ZUIReorderable;
