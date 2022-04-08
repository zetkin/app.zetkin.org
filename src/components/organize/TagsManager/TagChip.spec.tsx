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
      const removeTagButton = container.querySelector(`.MuiChip-deleteIcon`);
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
      const removeTagButton = container.querySelector(`.MuiChip-deleteIcon`);
      expect(removeTagButton).toBeNull();
    });
  });
});
