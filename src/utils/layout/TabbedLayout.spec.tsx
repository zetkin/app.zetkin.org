import TabbedLayout from './TabbedLayout';
import { fireEvent, render } from 'utils/testing';

const mockTabbedLayoutProps = {
  baseHref: '/alpha/beta/gamma',
  defaultTab: '/',
  tabs: [
    { href: '/', messageId: 'the.localisation.id.for.root' },
    { href: '/delta', messageId: 'the.localisation.id.for.delta' },
  ],
};

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('TabbedLayout.tsx', () => {
  describe('Tabbed layout with 2 tabs', () => {
    it('displays the tab labels', () => {
      const { getByText } = render(<TabbedLayout {...mockTabbedLayoutProps} />);
      mockTabbedLayoutProps.tabs.forEach((tab) => {
        const tabLabel = getByText(tab.messageId);
        expect(tabLabel).toBeTruthy();
      });
    });
    it('displays the sidebar', () => {
      const { getAllByTestId } = render(
        <TabbedLayout {...mockTabbedLayoutProps} />
      );
      const sidebar = getAllByTestId('organize-sidebar');
      expect(sidebar).toBeTruthy();
    });
    describe('collapse functionality', () => {
      let toggleButton: HTMLElement;
      describe('on fixed height pages', () => {
        beforeEach(() => {
          const { getByText } = render(
            <TabbedLayout {...mockTabbedLayoutProps} fixedHeight />
          );
          toggleButton = getByText(/header/i, { selector: 'button' });
        });
        it('is open by default', () => {
          expect(toggleButton.textContent).toContain('collapse');
        });
        it('correctly collapses', () => {
          fireEvent.click(toggleButton);
          expect(toggleButton.textContent).toContain('expand');
        });
      });
    });
  });
});
