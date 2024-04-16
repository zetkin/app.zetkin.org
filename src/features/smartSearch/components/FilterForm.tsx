import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import { FC, FormEvent } from 'react';

import { FilterConfigOrgOptions } from './types';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';

interface FilterFormProps {
  renderSentence: () => JSX.Element;
  renderExamples?: () => JSX.Element;
  disableSubmit?: boolean;
  onOrgsChange?: (orgs: FilterConfigOrgOptions) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  selectedOrgs?: FilterConfigOrgOptions;
}

const FilterForm: FC<FilterFormProps> = ({
  renderExamples,
  renderSentence,
  onCancel,
  onOrgsChange,
  disableSubmit,
  onSubmit,
  selectedOrgs,
}) => {
  const { orgId } = useNumericRouteParams();
  const orgsFuture = useSubOrganizations(orgId);

  if (!orgsFuture.data) {
    return null;
  }

  // TODO: Don't throw here
  if (typeof selectedOrgs == 'string') {
    throw new Error('All/Suborgs is not yet supported');
  }

  const selectedOrgOption = (selectedOrgs as number[])[0];

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Select
        onChange={(ev) => {
          onOrgsChange?.([ev.target.value as number]);
        }}
        value={selectedOrgOption}
      >
        {orgsFuture.data.map((org) => {
          return (
            <MenuItem key={org.id} value={org.id}>
              {org.title}
            </MenuItem>
          );
        })}
      </Select>
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
