import { Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ZetkinSurveyElement } from 'utils/types/zetkin';
import { useState } from 'react';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';

type BlockArrowIconProps = {
  blockIndex: number;
  blockIsOnEdit: boolean;
  blockLength: number;
  elements: ZetkinSurveyElement[];
  model: SurveyDataModel;
};

const BlockArrowIcon = ({
  blockIndex,
  blockLength,
  blockIsOnEdit,
  elements,
  model,
}: BlockArrowIconProps) => {
  // console.log(elements, ' this is data');
  // const [blocks, setBlocks] = useState(elements);

  const handleUp = () => {
    // console.log(elements, ' hell yeah data');
    // console.log(blockIndex, blockIndex - 1);
    let copy = [...elements];
    const value = copy.splice(blockIndex, 1)[0];
    copy.splice(blockIndex - 1, 0, value);
    console.log(copy);
    //copy is the changed array
    // setBlocks(copy);
    // model.updateBlockOrder(blockId, blocks);
  };
  console.log(elements);
  return (
    <>
      {blockIsOnEdit && (
        <Box display="flex" flexDirection="column">
          {blockIndex !== 0 && (
            <Box
              onClick={(e) => {
                e.stopPropagation(), handleUp();
              }}
            >
              <KeyboardArrowUpIcon sx={{ margin: '1em 1em 1em 0' }} />
            </Box>
          )}
          {blockIndex !== blockLength && (
            <Box onClick={(e) => e.stopPropagation()}>
              <KeyboardArrowDownIcon sx={{ margin: '1em 1em 1em 0' }} />
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default BlockArrowIcon;
