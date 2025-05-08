import { FC } from 'react';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIMarkdown from 'zui/ZUIMarkdown';

type Props = {
  instructions: string;
};

const InstructionsSection: FC<Props> = ({ instructions }) => {
  return (
    <ZUISection
      renderContent={() => (
        <ZUIText>
          <ZUIMarkdown markdown={instructions} />
        </ZUIText>
      )}
      title={'Instructions'}
    />
  );
};

export default InstructionsSection;
