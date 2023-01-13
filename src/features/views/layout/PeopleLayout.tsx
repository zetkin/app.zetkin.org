import { useIntl } from 'react-intl';

import SimpleLayout from 'utils/layout/SimpleLayout';

interface PeopleLayoutProps {
  children: React.ReactNode;
}

const PeopleLayout: React.FunctionComponent<PeopleLayoutProps> = ({
  children,
}) => {
  const intl = useIntl();

  return (
    <SimpleLayout
      noPad
      title={intl.formatMessage({ id: 'layout.organize.people.title' })}
    >
      {children}
    </SimpleLayout>
  );
};

export default PeopleLayout;
