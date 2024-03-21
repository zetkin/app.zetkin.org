import { MenuItem } from '@mui/material';
import { useState } from 'react';

import FilterForm from '../../FilterForm';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
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
enum LINK_SELECT {
  ANY_LINK = 'anyLink',
  FOLLOWING_LINKS = 'anyFollowingLinks',
}
enum EMAIL_SELECT {
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
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<EmailClickFilterConfig>(initialFilter, {
      operator: 'clicked',
    });
  const [emailSelect, setEmailSelect] = useState<EMAIL_SELECT>(
    filter.config.campaign
      ? EMAIL_SELECT.FROM_PROJECT
      : filter.config.email
      ? EMAIL_SELECT.SPECIFIC_EMAIL
      : EMAIL_SELECT.ANY
  );

  return (
    <FilterForm
      onCancel={onCancel}
      onSubmit={(e) => console.log('hello')}
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
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    operator: e.target.value as EMAIL_CLICK_OP,
                  })
                }
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
              <StyledSelect
                onChange={(e) => setEmailSelect(e.target.value as EMAIL_SELECT)}
                value={emailSelect}
              >
                {Object.values(EMAIL_SELECT).map((item) => {
                  if (
                    item !== EMAIL_SELECT.SPECIFIC_EMAIL &&
                    filter.config.email !== undefined
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
            linkSelect: (
              <StyledSelect
                onChange={(e) => {
                  if (e.target.value === LINK_SELECT.FOLLOWING_LINKS) {
                    setConfig({
                      ...filter.config,
                      email: 0,
                    });
                    setEmailSelect(EMAIL_SELECT.SPECIFIC_EMAIL);
                  } else {
                    setConfig({
                      ...filter.config,
                      email: undefined,
                    });
                  }
                }}
                value={
                  filter.config.email === undefined
                    ? LINK_SELECT.ANY_LINK
                    : LINK_SELECT.FOLLOWING_LINKS
                }
              >
                {Object.values(LINK_SELECT).map((item) => (
                  <MenuItem key={item} value={item}>
                    <Msg id={localMessageIds.linkSelect[item]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
          }}
        />
      )}
    />
  );
};

export default EmailClick;
