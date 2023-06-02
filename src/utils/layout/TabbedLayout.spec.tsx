import TabbedLayout from './TabbedLayout';
import { fireEvent, render } from 'utils/testing';

const mockTabbedLayoutProps = {
  baseHref: '/alpha/beta/gamma',
  defaultTab: '/',
  tabs: [
    { href: '/', label: 'Home' },
    { href: '/delta', label: 'Delta' },
  ],
};

jest.mock('next/dist/client/router', () => require('next-router-mock'));
jest.mock('features/user/hooks/useCurrentUser');

describe('TabbedLayout.tsx', () => {
  describe('Tabbed layout with 2 tabs', () => {
    it('displays the tab labels', () => {
      const { getByText } = render(<TabbedLayout {...mockTabbedLayoutProps} />);
      mockTabbedLayoutProps.tabs.forEach((tab) => {
        const tabLabel = getByText(tab.label);
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
