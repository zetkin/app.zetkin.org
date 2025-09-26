import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import { LaneStep, ZetkinCall } from '../types';
import ZUITabView from 'zui/components/ZUITabView';
import { AboutContent } from './AboutSection';

type Props = {
  call: ZetkinCall | null;
  instructions: string;
  step: LaneStep;
};

const Instructions = ({ instructions }: { instructions: string }) => (
  <ZUIText component="div">
    {instructions ? (
      <ZUIMarkdown markdown={instructions} />
    ) : (
      "This assignment doesn't have instructions."
    )}
  </ZUIText>
);

const InstructionsSection: FC<Props> = ({ call, instructions, step }) => {
  const [selectedTab, setSelectedTab] = useState<'instructions' | 'about'>(
    'instructions'
  );

  useEffect(() => {
    if (step == LaneStep.REPORT) {
      setSelectedTab('instructions');
      setTimeout(() => {
        setSelectedTab('about');
      }, 600);
    } else {
      setSelectedTab('instructions');
    }
  }, [step]);

  if (call && step == LaneStep.REPORT) {
    return (
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          minHeight: '100%',
        })}
      >
        <ZUITabView
          fullWidth
          items={[
            {
              label: 'Instructions',
              render: () => <Instructions instructions={instructions} />,
              value: 'instructions',
            },
            {
              label: `About ${call.target.first_name}`,
              render: () => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '100%',
                  }}
                >
                  <AboutContent call={call} />
                </Box>
              ),
              value: 'about',
            },
          ]}
          onSelectTab={() =>
            setSelectedTab(selectedTab == 'about' ? 'instructions' : 'about')
          }
          selectedTab={selectedTab}
        />
      </Box>
    );
  }
  return (
    <ZUISection
      borders={false}
      fullHeight
      renderContent={() => <Instructions instructions={instructions} />}
      title={'Instructions'}
    />
  );
};

export default InstructionsSection;
