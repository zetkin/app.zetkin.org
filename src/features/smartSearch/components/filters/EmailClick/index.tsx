import { useState } from 'react';
import { Box, Chip, MenuItem, Tooltip } from '@mui/material';

import FilterForm from '../../FilterForm';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledItemSelect from '../../inputs/StyledItemSelect';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import { truncateOnMiddle } from 'utils/stringUtils';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useEmailLinks from 'features/emails/hooks/useLinks';
import useEmails from 'features/emails/hooks/useEmails';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  EmailClickFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

const localMessageIds = messageIds.filters.emailClick;

enum EMAIL_CLICK_OP {
  CLICKED = 'clicked',
  NOT_CLICKED = 'not_clicked',
}
export enum LINK_SELECT_SCOPE {
  ANY_LINK = 'anyLink',
  ANY_LINK_IN_EMAIL = 'anyLinkInEmail',
  LINK_IN_PROJECT = 'linkInEmailFromProject',
  FOLLOWING_LINKS = 'anyFollowingLinks',
}

interface EmailClickProps {
  filter:
    | SmartSearchFilterWithId<EmailClickFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<EmailClickFilterConfig>
      | ZetkinSmartSearchFilter<EmailClickFilterConfig>
  ) => void;
  onCancel: () => void;
}

const EmailClick = ({
  filter: initialFilter,
  onCancel,
  onSubmit,
}: EmailClickProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const emails = useEmails(orgId).data || [];
  const projectsFuture = useCampaigns(orgId).data || [];

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<EmailClickFilterConfig>(initialFilter, {
      operator: 'clicked',
    });
  const linkList = useEmailLinks(orgId, filter.config?.email).data;

  const [linkSelectScope, setLinkSelectScope] = useState<LINK_SELECT_SCOPE>(
    filter.config.campaign
      ? LINK_SELECT_SCOPE.LINK_IN_PROJECT
      : filter.config.email && !filter.config.links
      ? LINK_SELECT_SCOPE.ANY_LINK_IN_EMAIL
      : filter.config.email && filter.config.links
      ? LINK_SELECT_SCOPE.FOLLOWING_LINKS
      : LINK_SELECT_SCOPE.ANY_LINK
  );

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    //This is for extracting after and before
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { after, before, ...rest } = filter.config;

    setConfig({
      ...rest,
      ...(range.after && { after: range.after }),
      ...(range.before && { before: range.before }),
    });
  };

  const setValueToKey = (
    key: keyof EmailClickFilterConfig,
    value: string | number | number[]
  ) => {
    setConfig({
      ...filter.config,
      [key]: value,
    });
  };
  const removeKey = (deleteKeys: (keyof EmailClickFilterConfig)[]) => {
    const copied = { ...filter.config };
    deleteKeys.forEach((key) => delete copied[key]);
    setConfig({
      ...copied,
    });
  };

  const selectedEmail = emails.find((email) => email.id == filter.config.email);

  return (
    <FilterForm
      disableSubmit={
        (linkSelectScope === LINK_SELECT_SCOPE.LINK_IN_PROJECT &&
          !filter.config.campaign) ||
        (linkSelectScope === LINK_SELECT_SCOPE.ANY_LINK_IN_EMAIL &&
          !filter.config.email) ||
        (linkSelectScope === LINK_SELECT_SCOPE.FOLLOWING_LINKS &&
          (!filter.config.email || !filter.config.links?.length))
      }
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setConfig({ ...filter.config, organizations: orgs });
      }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(filter);
      }}
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
            emailSelect:
              linkSelectScope === LINK_SELECT_SCOPE.ANY_LINK_IN_EMAIL ||
              linkSelectScope === LINK_SELECT_SCOPE.FOLLOWING_LINKS ? (
                <StyledSelect
                  minWidth="10rem"
                  onChange={(e) =>
                    setValueToKey('email', parseInt(e.target.value))
                  }
                  value={filter.config.email || ''}
                >
                  {emails.map((email) => (
                    <MenuItem key={email.id} value={email.id}>
                      <Tooltip
                        placement="right-start"
                        title={
                          !email.title || email.title.length < 40
                            ? ''
                            : email.title
                        }
                      >
                        <Box>{`"${truncateOnMiddle(
                          email.title ?? '',
                          40
                        )}"`}</Box>
                      </Tooltip>
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : null,
            linkScopeSelect: (
              <StyledSelect
                onChange={(e) => {
                  removeKey(['campaign', 'email', 'links']);
                  setLinkSelectScope(e.target.value as LINK_SELECT_SCOPE);
                }}
                value={linkSelectScope}
              >
                {Object.values(LINK_SELECT_SCOPE).map((item) => (
                  <MenuItem key={item} value={item}>
                    <Msg id={localMessageIds.linkScopeSelect[item]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            linkSelect:
              linkSelectScope === LINK_SELECT_SCOPE.FOLLOWING_LINKS &&
              linkList ? (
                <Box
                  alignItems="center"
                  display="inline-flex"
                  style={{ verticalAlign: 'middle' }}
                >
                  :
                  {linkList
                    .filter((item) => filter.config.links?.includes(item.id))
                    .map((link) => {
                      return (
                        <Tooltip key={`link-${link.id}`} title={link.url}>
                          <Chip
                            label={link.url.split('://')[1]}
                            onDelete={() =>
                              setValueToKey(
                                'links',
                                filter.config.links!.filter(
                                  (linkId) => linkId !== link.id
                                )
                              )
                            }
                            sx={{
                              margin: '3px',
                              maxWidth: '200px',
                              textOverflow: 'ellipsis',
                            }}
                            variant="outlined"
                          />
                        </Tooltip>
                      );
                    })}
                  <StyledItemSelect
                    getOptionDisabled={(link) =>
                      filter.config.links?.includes(link.id) || false
                    }
                    noOptionsText={
                      selectedEmail ? (
                        selectedEmail.processed ? (
                          <Msg id={messageIds.misc.noOptionsLinks} />
                        ) : (
                          <Msg id={messageIds.misc.noOptionsEmailNotSent} />
                        )
                      ) : (
                        <Msg id={messageIds.misc.noOptionsInvalidEmail} />
                      )
                    }
                    onChange={(_, value) =>
                      setValueToKey(
                        'links',
                        value.map((link) => link.id)
                      )
                    }
                    options={linkList.map((link) => ({
                      id: link.id,
                      title: link.url.split('://')[1],
                    }))}
                    value={linkList
                      .filter(
                        (link) =>
                          filter.config.links?.includes(link.id) || false
                      )
                      .map((item) => {
                        return { id: item.id, title: item.url };
                      })}
                  />
                </Box>
              ) : null,
            operatorSelect: (
              <StyledSelect
                onChange={(e) => setValueToKey('operator', e.target.value)}
                value={filter.config.operator}
              >
                <MenuItem value={EMAIL_CLICK_OP.CLICKED}>
                  <Msg id={localMessageIds.operatorSelect.clicked} />
                </MenuItem>
                <MenuItem value={EMAIL_CLICK_OP.NOT_CLICKED}>
                  <Msg id={localMessageIds.operatorSelect.notClicked} />
                </MenuItem>
              </StyledSelect>
            ),
            projectSelect:
              linkSelectScope === LINK_SELECT_SCOPE.LINK_IN_PROJECT ? (
                <StyledSelect
                  minWidth="10rem"
                  onChange={(e) =>
                    setValueToKey('campaign', parseInt(e.target.value))
                  }
                  value={filter.config.campaign || ''}
                >
                  {projectsFuture?.map((project) => (
                    <MenuItem key={`project-${project.id}`} value={project.id}>
                      {`"${project.title}"`}
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : null,
            timeFrame: (
              <TimeFrame
                filterConfig={{
                  after: filter.config.after,
                  before: filter.config.before,
                }}
                onChange={handleTimeFrameChange}
              />
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default EmailClick;
