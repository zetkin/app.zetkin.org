import { click } from '@testing-library/user-event/dist/click';
import { hover } from '@testing-library/user-event/dist/hover';
import { render } from 'utils/testing';

import mockTag from 'utils/testing/mocks/mockTag';
import TagChip from './TagChip';
import { ZetkinTag } from 'types/zetkin';

describe('<TagChip />', () => {
  describe('on hover', () => {
    it('has delete button if onDelete provided', () => {
      const onDelete = jest.fn((tag: ZetkinTag) => tag);
      const tag = mockTag();
      const { container, getByText } = render(
        <TagChip onDelete={onDelete} tag={tag} />
      );

      // Hover tag
      const tagEl = getByText(tag.title);
      hover(tagEl);

      // Shows delete button
      const removeTagButton = container.querySelector(
        '[data-testid=TagChip-deleteButton]'
      );
      expect(removeTagButton).not.toBeNull();

      // Calls onDelete when clicking
      if (removeTagButton) {
        click(removeTagButton);
      }
      expect(onDelete).toHaveBeenCalledWith(tag);
    });

    it('does not show delete button if onDelete not provided', () => {
      const tag = mockTag();
      const { container, getByText } = render(<TagChip tag={tag} />);

      // Hover tag
      const tagEl = getByText(tag.title);
      hover(tagEl);

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
