import { render } from 'utils/testing';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

import mockTag from 'utils/testing/mocks/mockTag';
import TagChip from './TagChip';
import { ZetkinTag } from 'utils/types/zetkin';

describe('<TagChip />', () => {
  describe('on hover', () => {
    it('has delete button if onDelete provided', async () => {
      const onDelete = jest.fn((tag: ZetkinTag) => tag);
      const tag = mockTag();
      const { container, getByText } = render(
        <TagChip onDelete={onDelete} tag={tag} />
      );

      // Hover tag
      const tagEl = getByText(tag.title);
      userEvent.hover(tagEl);

      // Shows delete button
      const removeTagButton = container.querySelector(
        '[data-testid=TagChip-deleteButton]'
      );

      expect(removeTagButton).not.toBeNull();

      // Calls onDelete when clicking
      if (removeTagButton) {
        userEvent.click(removeTagButton);
      }
      await waitFor(() => expect(onDelete).toHaveBeenCalledWith(tag));
      expect(onDelete).toHaveBeenCalledWith(tag);
    });

    it('does not show delete button if onDelete not provided', () => {
      const tag = mockTag();
      const { container, getByText } = render(<TagChip tag={tag} />);

      // Hover tag
      const tagEl = getByText(tag.title);
      userEvent.hover(tagEl);

      // Does not show delete button
      const removeTagButton = container.querySelector(
        '[data-testid=TagChip-deleteButton]'
      );
      expect(removeTagButton).toBeNull();
    });

    it('shows value for value tags', () => {
      const tag = mockTag({
        value: 'foo',
        value_type: 'string',
      });
      const { getByText } = render(<TagChip tag={tag} />);

      const valueEl = getByText(tag.value as string);
      expect(valueEl).not.toBeNull();
    });

    it('shows empty value for value tags without a value', () => {
      const tag = mockTag({
        value_type: 'string',
      });

      const { container } = render(<TagChip tag={tag} />);

      const valueEl = container.querySelector('[data-testid=TagChip-value]');
      expect(valueEl).not.toBeNull();
    });
  });
});
