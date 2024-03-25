import { Box, Chip, MenuItem, Tooltip } from '@mui/material';
import { useState } from 'react';

import FilterForm from '../../FilterForm';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledItemSelect from '../../inputs/StyledItemSelect';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useEmails from 'features/emails/hooks/useEmails';
import useLinks from 'features/emails/hooks/useLinks';
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
export enum LINK_TYPE_SELECT {
  ANY_LINK = 'anyLink',
  FOLLOWING_LINKS = 'anyFollowingLinks',
}
export enum LIST_SELECT {
  ANY = 'any',
  FROM_PROJECT = 'fromProject',
  SPECIFIC_EMAIL = 'specificEmail',
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
  const emailsFuture = useEmails(orgId).data || [];
  const projectsFuture = useCampaigns(orgId).data || [];

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<EmailClickFilterConfig>(initialFilter, {
      operator: 'clicked',
    });
  const linksFuture = useLinks(orgId, filter.config?.email).data;

  const [listSelectType, setListSelectType] = useState<LIST_SELECT>(
    filter.config.campaign
      ? LIST_SELECT.FROM_PROJECT
      : filter.config.email
      ? LIST_SELECT.SPECIFIC_EMAIL
      : LIST_SELECT.ANY
  );

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    /* eslint-disable-next-line */
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
  const handleLinkSelect = (value: string) => {
    if (value === LINK_TYPE_SELECT.FOLLOWING_LINKS) {
      removeKey(['campaign']);
      setValueToKey('links', []);
      setListSelectType(LIST_SELECT.SPECIFIC_EMAIL);
    } else {
      removeKey(['campaign', 'links']);
    }
  };

  const fakeLinkList = [
    { id: 1, url: 'http://www.hellomyexample/veryLong/long/long/long/url.com' },
    { id: 2, url: 'http://www.world.com' },
  ];

  console.log(filter, ' filter');

  return (
    <FilterForm
      disableSubmit={
        (listSelectType === LIST_SELECT.FROM_PROJECT &&
          !filter.config.campaign) ||
        (listSelectType === LIST_SELECT.SPECIFIC_EMAIL && !filter.config.email)
      }
      onCancel={onCancel}
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
            clickSelect: (
              <StyledSelect
                onChange={(e) => setValueToKey('operator', e.target.value)}
                value={filter.config.operator}
              >
                <MenuItem value={EMAIL_CLICK_OP.CLICKED}>
                  <Msg id={localMessageIds.clickSelect.clicked} />
                </MenuItem>
                <MenuItem value={EMAIL_CLICK_OP.NOT_CLICKED}>
                  <Msg id={localMessageIds.clickSelect.notClicked} />
                </MenuItem>
              </StyledSelect>
            ),
            emailSelect: (
              <>
                {''}
                {listSelectType === LIST_SELECT.SPECIFIC_EMAIL && (
                  <StyledSelect
                    onChange={(e) =>
                      setValueToKey('email', parseInt(e.target.value))
                    }
                    value={filter.config.email || ''}
                  >
                    {emailsFuture?.map((email) => (
                      <MenuItem key={`email-${email.id}`} value={email.id}>
                        {`"${email.title}"`}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                )}
              </>
            ),
            linkSelect: (
              <>
                {''}
                {filter.config.links && (
                  <Box
                    alignItems="center"
                    display="inline-flex"
                    style={{ verticalAlign: 'middle' }}
                  >
                    :
                    {fakeLinkList
                      .filter((item) => filter.config.links?.includes(item.id))
                      .map((link) => {
                        return (
                          <Tooltip title={link.url}>
                            <Chip
                              key={link.id}
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
                      getOptionDisabled={(t) =>
                        filter.config.links?.includes(t.id) || false
                      }
                      onChange={(_, value) =>
                        setValueToKey(
                          'links',
                          value.map((link) => link.id)
                        )
                      }
                      options={fakeLinkList.map((link) => ({
                        id: link.id,
                        title: link.url.split('://')[1],
                      }))}
                      value={fakeLinkList
                        .filter(
                          (t) => filter.config.links?.includes(t.id) || false
                        )
                        .map((item) => {
                          return { id: item.id, title: item.url };
                        })}
                    />
                  </Box>
                )}
              </>
            ),
            linkTypeSelect: (
              <StyledSelect
                onChange={(e) => handleLinkSelect(e.target.value)}
                value={
                  filter.config.links
                    ? LINK_TYPE_SELECT.FOLLOWING_LINKS
                    : LINK_TYPE_SELECT.ANY_LINK
                }
              >
                {Object.values(LINK_TYPE_SELECT).map((item) => (
                  <MenuItem key={item} value={item}>
                    <Msg id={localMessageIds.linkSelect[item]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            listSelect: (
              <StyledSelect
                onChange={(e) => {
                  removeKey(['email', 'campaign', 'links']);
                  setListSelectType(e.target.value as LIST_SELECT);
                }}
                value={listSelectType}
              >
                {Object.values(LIST_SELECT).map((item) => {
                  if (
                    //when user choose 'any of the following links' in 'the specific email'
                    //some options should not be visible
                    item !== LIST_SELECT.SPECIFIC_EMAIL &&
                    filter.config.links
                  ) {
                    return null;
                  } else {
                    return (
                      <MenuItem key={item} value={item}>
                        <Msg id={messageIds.filters.emailListSelect[item]} />
                      </MenuItem>
                    );
                  }
                })}
              </StyledSelect>
            ),
            projectSelect: (
              <>
                {''}
                {listSelectType === LIST_SELECT.FROM_PROJECT && (
                  <StyledSelect
                    onChange={(e) =>
                      setValueToKey('campaign', parseInt(e.target.value))
                    }
                    value={filter.config.campaign || ''}
                  >
                    {projectsFuture?.map((project) => (
                      <MenuItem
                        key={`proejct-${project.id}`}
                        value={project.id}
                      >
                        {`"${project.title}"`}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                )}
              </>
            ),
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
    />
  );
};

export default EmailClick;
