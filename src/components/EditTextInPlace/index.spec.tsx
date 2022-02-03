import userEvent from '@testing-library/user-event';
import { act, render } from 'utils/testing';
import EditTextinPlace, { EditTextinPlaceProps } from '.';

const props: EditTextinPlaceProps = {
  onChange: async () => undefined,
  value: 'Current Text',
};

describe('EditTextInPlace', () => {
  it('shows the current text', () => {
    const { getByDisplayValue } = render(<EditTextinPlace {...props} />);
    const inputEl = getByDisplayValue(props.value);
    expect(inputEl).not.toBeNull();
  });

  it('shows a tooltip informing the user to edit on hover', async () => {
    const { getByDisplayValue, findByText } = render(
      <EditTextinPlace {...props} />
    );
    const inputEl = getByDisplayValue(props.value);
    userEvent.hover(inputEl);
    const tooltip = await findByText(
      'misc.components.editTextInPlace.tooltip.edit'
    );
    expect(tooltip).not.toBeNull();
  });

  it('shows a tooltip informing the user to press enter to save when focussed', async () => {
    const { getByDisplayValue, findByText } = render(
      <EditTextinPlace {...props} />
    );
    const inputEl = getByDisplayValue(props.value);
    userEvent.hover(inputEl);
    userEvent.click(inputEl);
    const tooltip = await findByText(
      'misc.components.editTextInPlace.tooltip.save'
    );
    expect(tooltip).not.toBeNull();
  });

  it('shows a tooltip informing the user the field must not be empty when no text', async () => {
    const { getByDisplayValue, findByText } = render(
      <EditTextinPlace {...props} />
    );
    const inputEl = getByDisplayValue(props.value);
    userEvent.hover(inputEl);
    userEvent.click(inputEl);
    userEvent.clear(inputEl);
    const tooltip = await findByText(
      'misc.components.editTextInPlace.tooltip.noEmpty'
    );
    expect(tooltip).not.toBeNull();
  });

  it('does not trigger onChange if no text or value is unchanged', async () => {
    const onChange = jest.fn(props.onChange);
    const { getByDisplayValue } = render(
      <EditTextinPlace {...{ ...props, onChange }} />
    );
    const inputEl = getByDisplayValue(props.value);
    userEvent.click(inputEl);
    // If user tries to save no text
    userEvent.clear(inputEl);
    userEvent.keyboard('{enter}');
    expect(onChange).toHaveBeenCalledTimes(0);
    // If user saves the previous value, it doesn't need to save
    userEvent.paste(inputEl, props.value);
    userEvent.keyboard('{enter}');
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('resets when text is discarded with "escape"', async () => {
    const onChange = jest.fn(props.onChange);
    const { getByDisplayValue } = render(
      <EditTextinPlace {...{ ...props, onChange }} />
    );
    const inputEl = getByDisplayValue(props.value) as HTMLInputElement;
    userEvent.click(inputEl);
    userEvent.paste(inputEl, 'New Text');
    userEvent.keyboard('{escape}');
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(inputEl.value).toBe(props.value);
  });

  it('triggers onChange when text is submitted with "enter"', async () => {
    const onChange = jest.fn(props.onChange);
    const { getByDisplayValue } = render(
      <EditTextinPlace {...{ ...props, onChange }} />
    );
    const inputEl = getByDisplayValue(props.value);
    userEvent.click(inputEl);
    userEvent.paste(inputEl, 'New Text');
    await act(async () => {
      userEvent.keyboard('{enter}');
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
