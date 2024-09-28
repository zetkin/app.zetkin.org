import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import { CSSProperties } from 'react';
import { Typography } from '@mui/material';

type button = {
  name: string;
  value: string;
  disabled?: boolean;
};

type TLabelPlacement = 'start' | 'end' | 'top' | 'bottom';
type TRadioGroupDirection = 'row' | 'column';

interface ZUIRadioButtonProps {
  name: string;
  options: button[];
  labelPlacement: TLabelPlacement;
  disabled: boolean;
  direction: TRadioGroupDirection;
}

const ZUIRadioGroup = ({
  name,
  options,
  labelPlacement,
  disabled,
  direction,
}: ZUIRadioButtonProps) => {
  const fieldsetStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'column' ? 'column' : 'row',
    gap: '1.5rem',
  };

  const wrapperStyle: CSSProperties = {
    fontFamily: '', //TODO: get the font to work
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    fontSize: '24px',
    width: 'fit-content',
    justifyItems: 'center',
    justifyContent: 'center',
    ...(labelPlacement === 'start' && { flexDirection: 'row-reverse' }),
    ...(labelPlacement === 'end' && { flexDirection: 'row' }),
    ...(labelPlacement === 'top' && { flexDirection: 'column-reverse' }),
    ...(labelPlacement === 'bottom' && { flexDirection: 'column' }),
  };

  const radioStyle: CSSProperties = {
    width: '32px',
    height: '32px',
  };

  return (
    <>
      <fieldset style={fieldsetStyle} disabled={disabled}>
        {options.map((button) => {
          return (
            <div style={wrapperStyle}>
              <input
                style={radioStyle}
                type="radio"
                name={name}
                id={button.name}
                disabled={button.disabled}
              />
              <Typography>
                <Msg id={messageIds.radioGroup.label} />
              </Typography>
            </div>
          );
        })}
      </fieldset>
    </>
  );
};

export default ZUIRadioGroup;
