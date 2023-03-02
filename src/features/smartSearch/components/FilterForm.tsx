import { FormEvent } from 'react';
import { Box, Button, Typography } from '@mui/material';

import { Msg } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface FilterFormProps {
  renderSentence: () => JSX.Element;
  renderExamples?: () => JSX.Element;
  disableSubmit?: boolean;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

const FilterForm = ({
  renderExamples,
  renderSentence,
  onCancel,
  disableSubmit,
  onSubmit,
}: FilterFormProps): JSX.Element => {
  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Box display="flex" flexDirection="column" height={1} padding={1}>
        <Box
          alignItems="center"
          display="flex"
          flex={20}
          justifyContent="center"
          padding={10}
        >
          <Typography
            style={{ lineHeight: 'unset', marginBottom: '2rem' }}
            variant="h4"
          >
            {renderSentence()}
          </Typography>
        </Box>
        <Box>
          <Box display="flex" flex={1} justifyContent="space-between">
            <Box display="flex" flexDirection="column">
              {renderExamples && (
                <>
                  <Typography variant="h5">
                    <Msg id={messageIds.headers.examples} />
                  </Typography>
                  <Typography color="textSecondary">
                    {renderExamples()}
                  </Typography>
                </>
              )}
            </Box>
            <Box
              alignItems="flex-end"
              display="flex"
              justifyContent="flex-end"
              m={1}
              style={{ gap: '1rem' }}
            >
              <Button color="primary" onClick={onCancel} variant="outlined">
                <Msg id={messageIds.buttonLabels.cancel} />
              </Button>
              <Button
                color="primary"
                data-testid="FilterForm-saveButton"
                disabled={disableSubmit}
                type="submit"
                variant="contained"
              >
                <Msg id={messageIds.buttonLabels.add} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default FilterForm;
