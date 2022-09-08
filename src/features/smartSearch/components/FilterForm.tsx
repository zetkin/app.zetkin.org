import { FormEvent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Typography } from '@material-ui/core';

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
                    <Msg id="misc.smartSearch.headers.examples" />
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
                <Msg id="misc.smartSearch.buttonLabels.cancel" />
              </Button>
              <Button
                color="primary"
                data-testid="FilterForm-saveButton"
                disabled={disableSubmit}
                type="submit"
                variant="contained"
              >
                <Msg id="misc.smartSearch.buttonLabels.add" />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default FilterForm;
