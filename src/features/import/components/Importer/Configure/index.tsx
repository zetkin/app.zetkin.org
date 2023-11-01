import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  AccordionDetails,
  AccordionSummary,
  styled,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import SheetSettings, { ExperimentSheet } from './SheetSettings';

interface ConfigureProps {
  sheets: ExperimentSheet[];
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:before': {
    display: 'none',
  },
  border: 0,
}));

const Configure: FC<ConfigureProps> = ({ sheets }) => {
  const [firstRowIsHeaders, setFirstRowIsHeaders] = useState(true);
  const [selectedSheetId, setSelectedSheetId] = useState(sheets[0].id);

  const selectedSheet = sheets.find((sheet) => sheet.id === selectedSheetId);

  return (
    <>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h5">
            <Msg id={messageIds.configuration.settings.header} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SheetSettings
            firstRowIsHeaders={firstRowIsHeaders}
            onChangeFirstRowIsHeaders={() =>
              setFirstRowIsHeaders(!firstRowIsHeaders)
            }
            onChangeSelectedSheet={(id: number) => setSelectedSheetId(id)}
            selectedSheet={selectedSheetId}
            sheets={sheets}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h5">
            <Msg id={messageIds.configuration.mapping.header} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Mapping
            firstRowIsHeaders={firstRowIsHeaders}
            rows={selectedSheet?.data}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Configure;
