import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act, render } from 'utils/testing';
import ZUIEditTextinPlace, {
  ZUIEditTextinPlaceProps,
} from 'zui/ZUIEditTextInPlace';

import messageIds from 'zui/l10n/messageIds';

const props: ZUIEditTextinPlaceProps = {
  onChange: async () => undefined,
  value: 'Current Text',
};

describe('ZUIEditTextInPlace', () => {
  it('shows the current text', () => {
    const { getByDisplayValue } = render(<ZUIEditTextinPlace {...props} />);
    const inputEl = getByDisplayValue(props.value);
    expect(inputEl).not.toBeNull();
  });

  it('shows a tooltip informing the user to edit on hover', async () => {
    const { getByDisplayValue, findByMessageId } = render(
      <ZUIEditTextinPlace {...props} />
    );
    const inputEl = getByDisplayValue(props.value);
    await userEvent.hover(inputEl);
    const tooltip = await findByMessageId(
      messageIds.editTextInPlace.tooltip.edit
    );
    expect(tooltip).not.toBeNull();
  });

  it('shows no tooltip when editing.', async () => {
    const { getByDisplayValue, queryByRole } = render(
      <ZUIEditTextinPlace {...props} />
    );
    const inputEl = getByDisplayValue(props.value);
    await act(async () => {
      await userEvent.click(inputEl);
      await userEvent.hover(inputEl);
    });
    const tooltip = queryByRole('tooltip');
    expect(tooltip).toBeNull();
  });

  it('shows a tooltip informing the user the field must not be empty when no text', async () => {
    const { getByDisplayValue, findByMessageId } = render(
      <ZUIEditTextinPlace {...props} />
    );
    const inputEl = getByDisplayValue(props.value);
    await act(async () => {
      await userEvent.click(inputEl);
    });
    await act(async () => {
      await userEvent.clear(inputEl);
      await userEvent.hover(inputEl);
    });
    const tooltip = await findByMessageId(
      messageIds.editTextInPlace.tooltip.noEmpty
    );
    expect(tooltip).not.toBeNull();
  });

  it('does not trigger onChange if no text or value is unchanged', async () => {
    const onChange = jest.fn(props.onChange);
    const { getByDisplayValue } = render(
      <ZUIEditTextinPlace {...{ ...props, onChange }} />
    );
    const inputEl = getByDisplayValue(props.value);
    await act(async () => {
      await userEvent.click(inputEl);
    });
    // If user tries to save no text
    await act(async () => {
      await userEvent.clear(inputEl);
      await userEvent.keyboard('{enter}');
    });
    expect(onChange).toHaveBeenCalledTimes(0);
    // If user saves the previous value, it doesn't need to save
    await act(async () => {
      await userEvent.paste(props.value);
      await userEvent.keyboard('{enter}');
    });
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('does trigger onChange with no text if explicitly allowed', async () => {
    const onChange = jest.fn(props.onChange);
    const { getByDisplayValue } = render(
      <ZUIEditTextinPlace allowEmpty={true} {...{ ...props, onChange }} />
    );
    const inputEl = getByDisplayValue(props.value);
    await act(async () => {
      await userEvent.click(inputEl);
    });

    // If user tries to save no text
    await act(async () => {
      await userEvent.clear(inputEl);
      await userEvent.keyboard('{enter}');
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('resets when text is discarded with "escape"', async () => {
    const onChange = jest.fn(props.onChange);
    const { getByDisplayValue } = render(
      <ZUIEditTextinPlace {...{ ...props, onChange }} />
    );
    const inputEl = getByDisplayValue(props.value) as HTMLInputElement;
    await act(async () => {
      await userEvent.click(inputEl);
      await userEvent.paste('New Text');
      await userEvent.keyboard('{escape}');
    });
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(inputEl.value).toBe(props.value);
  });

  it('triggers onChange when text is submitted with "enter"', async () => {
    const onChange = jest.fn(props.onChange);
    const { getByDisplayValue } = render(
      <ZUIEditTextinPlace {...{ ...props, onChange }} />
    );
    const inputEl = getByDisplayValue(props.value);
    await act(async () => {
      await userEvent.click(inputEl);
    });
    await act(async () => {
      await userEvent.paste('New Text');
      await userEvent.keyboard('{enter}');
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('triggers onChange when text is submitted with click away', async () => {
    const onChange = jest.fn(props.onChange);
    const { getByDisplayValue } = render(
      <ZUIEditTextinPlace {...{ ...props, onChange }} />
    );
    const inputEl = getByDisplayValue(props.value);
    await act(async () => {
      await userEvent.click(inputEl);
    });
    await act(async () => {
      await userEvent.clear(inputEl);
      await userEvent.paste('New Text');

      fireEvent.blur(inputEl);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('New Text');
  });
});
