import userEvent from '@testing-library/user-event';
import { act, render } from 'test-utils';
import EditTextinPlace, { ComponentProps } from './index';

const props: ComponentProps = {
    defaultText: 'Default Text',
    label: 'Label',
    onSubmit: async (newText: string) => !!newText,
    text: 'Current Text',
};

describe('EditTextInPlace', () => {
    it('shows the current text', () => {
        const { getByDisplayValue } = render(<EditTextinPlace { ...props } />);
        const inputEl = getByDisplayValue(props.text);
        expect(inputEl).not.toBeNull();
    });

    it('shows a tooltip on hover', async () => {
        const { getByDisplayValue, findByText } = render(<EditTextinPlace { ...props } />);
        const inputEl = getByDisplayValue(props.text);
        userEvent.hover(inputEl);
        const tooltip = await findByText('misc.components.editTextInPlace.tooltip.edit');
        expect(tooltip).not.toBeNull();
    });

    it('shows a different tooltip on hover & click', async () => {
        const { getByDisplayValue, findByText } = render(<EditTextinPlace { ...props } />);
        const inputEl = getByDisplayValue(props.text);
        userEvent.hover(inputEl);
        userEvent.click(inputEl);
        const tooltip = await findByText('misc.components.editTextInPlace.tooltip.save');
        expect(tooltip).not.toBeNull();
    });

    it('does not submit if text is null or unchanged', async () => {
        const onSubmit = jest.fn(props.onSubmit);
        const { getByDisplayValue } = render(<EditTextinPlace { ...{ ...props, onSubmit } } />);
        const inputEl = getByDisplayValue(props.text);
        userEvent.click(inputEl);
        userEvent.clear(inputEl);
        userEvent.keyboard('{enter}');
        expect(onSubmit).toHaveBeenCalledTimes(0);
        userEvent.paste(inputEl, props.text);
        userEvent.keyboard('{enter}');
        expect(onSubmit).toHaveBeenCalledTimes(0);
    });

    it('calls the submit function when text is changed', async () => {
        const onSubmit = jest.fn(props.onSubmit);
        const { getByDisplayValue } = render(<EditTextinPlace { ...{ ...props, onSubmit } } />);
        const inputEl = getByDisplayValue(props.text);
        userEvent.click(inputEl);
        userEvent.paste(inputEl, 'New Text');
        await act(async () => {
            userEvent.keyboard('{enter}');
        });
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(await onSubmit.mock.results[0].value).toEqual(true);
    });
});
