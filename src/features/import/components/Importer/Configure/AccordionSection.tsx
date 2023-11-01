import { ExpandMore } from '@mui/icons-material';
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

import messageIds from 'features/import/l10n/messageIds';
import { useMessages } from 'core/i18n';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:before': {
    display: 'none',
  },
  border: 0,
}));

interface AccordionSectionProps {
  children: ReactNode;
  header: string;
}

const AccordionSection: FC<AccordionSectionProps> = ({ children, header }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  return (
    <Accordion
      defaultExpanded
      disableGutters
      onChange={(ev, isExpanded) => setExpanded(isExpanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: theme.palette.primary.main }} />}
      >
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="h5">{header}</Typography>
          <Typography color={theme.palette.primary.main} paddingRight={1}>
            {expanded
              ? messages.configuration.hide().toLocaleUpperCase()
              : messages.configuration.show().toLocaleUpperCase()}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default AccordionSection;
