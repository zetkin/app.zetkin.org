import { Box, Chip, MenuItem } from '@mui/material';
import { FormEvent, useState } from 'react';

import FilterForm from '../../FilterForm';
import StyledItemSelect from '../../inputs/StyledItemSelect';
import StyledSelect from '../../inputs/StyledSelect';
import { useNumericRouteParams } from 'core/hooks';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  ChannelSubscriptionFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinEmailConfig } from 'utils/types/zetkin';

const localMessageIds = messageIds.filters.channelSubscription;

type ChannelScope = 'allOf' | 'anyChannel' | 'anyOf';

const getScope = (config: ChannelSubscriptionFilterConfig): ChannelScope => {
  if (!config.channels?.length) {
    return 'anyChannel';
  }

  return config.condition === 'all' ? 'allOf' : 'anyOf';
};

interface ChannelSubscriptionProps {
  filter:
    | SmartSearchFilterWithId<ChannelSubscriptionFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<ChannelSubscriptionFilterConfig>
      | ZetkinSmartSearchFilter<ChannelSubscriptionFilterConfig>
  ) => void;
  onCancel: () => void;
}

const ChannelSubscription = ({
  filter: initialFilter,
  onCancel,
  onSubmit,
}: ChannelSubscriptionProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const channels = useEmailConfigs(orgId).data || [];
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<ChannelSubscriptionFilterConfig>(initialFilter, {
      operator: 'subscribed',
    });
  const [scope, setScope] = useState<ChannelScope>(getScope(filter.config));

  const selectedChannels = (filter.config.channels || []).reduce(
    (acc: ZetkinEmailConfig[], id) => {
      const channel = channels.find((channel) => channel.id === id);
      return channel ? acc.concat(channel) : acc;
    },
    []
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleScopeChange = (newScope: ChannelScope) => {
    setScope(newScope);

    if (newScope === 'anyChannel') {
      setConfig({
        ...filter.config,
        channels: undefined,
        condition: 'any',
      });
    } else {
      setConfig({
        ...filter.config,
        channels: filter.config.channels || [],
        condition: newScope === 'allOf' ? 'all' : 'any',
      });
    }
  };

  const handleChannelChange = (channels: { id: number; title: string }[]) => {
    setConfig({
      ...filter.config,
      channels: channels.map((channel) => channel.id),
    });
  };

  const handleChannelDelete = (channel: ZetkinEmailConfig) => {
    setConfig({
      ...filter.config,
      channels: filter.config.channels?.filter((id) => id !== channel.id),
    });
  };

  const channelSelect =
    scope === 'anyChannel' ? null : (
      <Box
        alignItems="center"
        display="inline-flex"
        sx={{ flexWrap: 'wrap', gap: 1 }}
      >
        {selectedChannels.map((channel) => (
          <Chip
            key={channel.id}
            label={channel.sender_name}
            onDelete={() => handleChannelDelete(channel)}
            size="small"
            variant="outlined"
          />
        ))}
        <StyledItemSelect
          getOptionDisabled={(channel) =>
            selectedChannels.some((selected) => selected.id === channel.id)
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, value) => handleChannelChange(value)}
          options={channels.map((channel) => ({
            id: channel.id,
            title: channel.sender_name,
          }))}
          value={selectedChannels.map((channel) => ({
            id: channel.id,
            title: channel.sender_name,
          }))}
        />
      </Box>
    );

  return (
    <FilterForm
      disableSubmit={scope !== 'anyChannel' && selectedChannels.length === 0}
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setConfig({ ...filter.config, organizations: orgs });
      }}
      onSubmit={handleSubmit}
      renderExamples={() => (
        <>
          <Msg id={localMessageIds.examples.one} />
          <br />
          <Msg id={localMessageIds.examples.two} />
        </>
      )}
      renderSentence={() => (
        <Msg
          id={localMessageIds.inputString}
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                {Object.values(OPERATION).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={messageIds.operators[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            channels: channelSelect,
            operatorSelect: (
              <StyledSelect
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    operator: e.target.value as
                      | 'subscribed'
                      | 'not_subscribed',
                  })
                }
                value={filter.config.operator}
              >
                <MenuItem value="subscribed">
                  <Msg id={localMessageIds.operatorSelect.subscribed} />
                </MenuItem>
                <MenuItem value="not_subscribed">
                  <Msg id={localMessageIds.operatorSelect.notSubscribed} />
                </MenuItem>
              </StyledSelect>
            ),
            scopeSelect: (
              <StyledSelect
                onChange={(e) => handleScopeChange(e.target.value as ChannelScope)}
                value={scope}
              >
                <MenuItem value="anyChannel">
                  <Msg id={localMessageIds.scopeSelect.anyChannel} />
                </MenuItem>
                <MenuItem value="anyOf">
                  <Msg id={localMessageIds.scopeSelect.anyOf} />
                </MenuItem>
                <MenuItem value="allOf">
                  <Msg id={localMessageIds.scopeSelect.allOf} />
                </MenuItem>
              </StyledSelect>
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default ChannelSubscription;
