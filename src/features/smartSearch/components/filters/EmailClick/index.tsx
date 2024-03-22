import { MenuItem } from '@mui/material';
import { useState } from 'react';

import FilterForm from '../../FilterForm';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
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
enum LINK_TYPE_SELECT {
  ANY_LINK = 'anyLink',
  FOLLOWING_LINKS = 'anyFollowingLinks',
}
enum LIST_SELECT {
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
      setValueToKey('link', []);
      setListSelectType(LIST_SELECT.SPECIFIC_EMAIL);
    } else {
      removeKey(['campaign', 'link']);
    }
  };

  const fakeLinkList = [
    { id: 1, link: 'www.hello.com' },
    { id: 2, link: 'www.world.com' },
  ];
  console.log(filter, 'filter');

  return (
    <FilterForm
      onCancel={onCancel}
      onSubmit={() => console.log('hello')}
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
                  <>
                    "
                    <StyledSelect
                      onChange={(e) =>
                        setValueToKey('email', parseInt(e.target.value))
                      }
                      value={filter.config.email || ''}
                    >
                      {emailsFuture?.map((email) => (
                        <MenuItem key={`email-${email.id}`} value={email.id}>
                          {email.title}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                    "
                  </>
                )}
              </>
            ),
            linkSelect: (
              <>
                {filter.config.link ? ':' : ''}
                {filter.config.link && (
                  <StyledSelect
                    onChange={(e) =>
                      setValueToKey('link', [parseInt(e.target.value)])
                    }
                    sx={{ ml: 0.5 }}
                    value={filter.config.email || ''}
                  >
                    {fakeLinkList?.map((item) => (
                      <MenuItem key={`link-${item.id}`} value={item.id}>
                        {item.link}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                )}
              </>
            ),
            linkTypeSelect: (
              <StyledSelect
                onChange={(e) => handleLinkSelect(e.target.value)}
                value={
                  filter.config.link
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
                  removeKey(['email', 'campaign', 'link']);
                  setListSelectType(e.target.value as LIST_SELECT);
                }}
                value={listSelectType}
              >
                {Object.values(LIST_SELECT).map((item) => {
                  if (
                    //when user choose 'any of the following links' in 'the specific email'
                    //some options should not be visible
                    item !== LIST_SELECT.SPECIFIC_EMAIL &&
                    filter.config.link
                  ) {
                    return null;
                  } else {
                    return (
                      <MenuItem key={item} value={item}>
                        <Msg id={localMessageIds.emailSelect[item]} />
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
                  <>
                    "
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
                          {project.title}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                    "
                  </>
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
