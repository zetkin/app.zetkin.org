import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import { LaneStep, UnfinishedCall } from '../types';
import ZUITabView from 'zui/components/ZUITabView';
import { AboutContent } from './AboutSection';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  call: UnfinishedCall | null;
  instructions: string;
  step: LaneStep;
};

const Instructions = ({ instructions }: { instructions: string }) => (
  <ZUIText component="div">
    {instructions ? (
      <Box sx={{ paddingBottom: 10 }}>
        <ZUIMarkdown markdown={instructions} />
      </Box>
    ) : (
      <Msg id={messageIds.instructions.noInstructions} />
    )}
  </ZUIText>
);

const InstructionsSection: FC<Props> = ({ call, instructions, step }) => {
  const messages = useMessages(messageIds);
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
              label: messages.instructions.title(),
              render: () => <Instructions instructions={instructions} />,
              value: 'instructions',
            },
            {
              label: messages.about.title({
                name: call.target.first_name,
              }),
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
      title={messages.instructions.title()}
    />
  );
};

export default InstructionsSection;
