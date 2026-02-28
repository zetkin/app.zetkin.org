import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { act, render } from 'utils/testing';
import ZUIModal, { ZUIModalProps } from '.';

const defaultProps: ZUIModalProps = {
  open: true,
  title: 'Test Modal',
};

/**
 * Integration tests for ZUIModal keyboard event propagation.
 */
describe('ZUIModal', () => {
  describe('keyboard event propagation prevention', () => {
    it('prevents keyboard events from propagating to window by default', async () => {
      const windowKeydownHandler = jest.fn();
      window.addEventListener('keydown', windowKeydownHandler);

      const { getByText } = render(
        <ZUIModal {...defaultProps}>
          <input data-testid="modal-input" placeholder="Test input" />
        </ZUIModal>
      );

      // Wait for modal to render
      await waitFor(() => {
        expect(getByText('Test Modal')).not.toBeNull();
      });

      // Find the input and type
      const input = document.querySelector(
        '[data-testid="modal-input"]'
      ) as HTMLInputElement;

      if (input) {
        await act(async () => {
          await userEvent.click(input);
          await userEvent.type(input, '1');
        });

        // The window listener should NOT have been called
        expect(windowKeydownHandler).not.toHaveBeenCalled();
      }

      window.removeEventListener('keydown', windowKeydownHandler);
    });

    it('allows keyboard events to propagate when allowPropagation is true', async () => {
      const windowKeydownHandler = jest.fn();
      window.addEventListener('keydown', windowKeydownHandler);

      const { getByText } = render(
        <ZUIModal {...defaultProps} allowPropagation={true}>
          <input data-testid="modal-input" placeholder="Test input" />
        </ZUIModal>
      );

      await waitFor(() => {
        expect(getByText('Test Modal')).not.toBeNull();
      });

      const input = document.querySelector(
        '[data-testid="modal-input"]'
      ) as HTMLInputElement;

      if (input) {
        await act(async () => {
          await userEvent.click(input);
          await userEvent.type(input, '1');
        });

        // The window listener SHOULD have been called
        expect(windowKeydownHandler).toHaveBeenCalled();
      }

      window.removeEventListener('keydown', windowKeydownHandler);
    });

    it('simulates the bug: typing in modal should not trigger external keyboard shortcuts', async () => {
      // Simulates the QuickResponseButtons behavior from the bug report
      const responses: string[] = [];
      const externalShortcutHandler = (ev: KeyboardEvent) => {
        const pressedNumber = Number.parseInt(ev.key);
        if (!Number.isNaN(pressedNumber) && pressedNumber <= 2) {
          responses.push(`option_${pressedNumber}`);
        }
      };

      window.addEventListener('keydown', externalShortcutHandler);

      const { getByText } = render(
        <ZUIModal {...defaultProps} title="Call log">
          <input
            data-testid="search-input"
            placeholder="Type to find"
            type="text"
          />
        </ZUIModal>
      );

      await waitFor(() => {
        expect(getByText('Call log')).not.toBeNull();
      });

      const searchInput = document.querySelector(
        '[data-testid="search-input"]'
      ) as HTMLInputElement;

      if (searchInput) {
        // Type "1" into the search field (the bug scenario)
        await act(async () => {
          await userEvent.click(searchInput);
          await userEvent.type(searchInput, '1');
        });

        // The external shortcut handler should NOT have been triggered
        expect(responses).toHaveLength(0);

        // Verify the input received the character
        expect(searchInput.value).toBe('1');
      }

      window.removeEventListener('keydown', externalShortcutHandler);
    });
  });

  describe('basic modal functionality', () => {
    it('renders the modal with title', async () => {
      const { getByText } = render(<ZUIModal {...defaultProps} />);

      await waitFor(() => {
        expect(getByText('Test Modal')).not.toBeNull();
      });
    });

    it('renders children', async () => {
      const { getByText } = render(
        <ZUIModal {...defaultProps}>
          <div>Modal Content</div>
        </ZUIModal>
      );

      await waitFor(() => {
        expect(getByText('Modal Content')).not.toBeNull();
      });
    });

    it('does not render when open is false', () => {
      const { queryByText } = render(
        <ZUIModal {...defaultProps} open={false} />
      );

      expect(queryByText('Test Modal')).toBeNull();
    });
  });
});
