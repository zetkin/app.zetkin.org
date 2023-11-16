import { useState } from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, Typography, useTheme } from '@mui/material';

import { Msg } from 'core/i18n';

import messageIds from 'features/import/l10n/messageIds';
interface testProp {
  title: string;
  value: string;
}

const MappingPreview = () => {
  const theme = useTheme();
  const [data, setData] = useState<testProp[][]>([
    [{ title: 'title', value: '0' }],
    [{ title: 'title1', value: '1' }],
    [{ title: 'title2', value: '2' }],
  ]);
  const [personIndex, setPersonIndex] = useState(0);

  const add = () => {
    const ranNum = Math.random().toFixed(2);
    const yeah = {
      title: `title ${ranNum}`,
      value: ranNum,
    };
    setData((prev) => {
      const newData = [...prev];
      newData[personIndex] = [...newData[personIndex], yeah];
      return newData;
    });
  };

  return (
    <Box p={2} sx={{ bgColor: 'beige' }}>
      <Button onClick={add} variant="contained">
        Click
      </Button>
      <Box alignItems="center" display="flex" sx={{ mb: 1.5 }}>
        <Typography sx={{ mr: 2 }} variant="h5">
          <Msg id={messageIds.configuration.preview.title} />
        </Typography>
        <Button
          disabled={personIndex === 0}
          onClick={() =>
            setPersonIndex((prev) => (personIndex !== 0 ? prev - 1 : prev))
          }
          startIcon={<ArrowBackIos />}
        >
          <Msg id={messageIds.configuration.preview.previous} />
        </Button>
        <Button
          disabled={personIndex === data.length - 1}
          endIcon={<ArrowForwardIos />}
          onClick={() =>
            setPersonIndex((prev) =>
              personIndex < data.length - 1 ? prev + 1 : prev
            )
          }
        >
          <Msg id={messageIds.configuration.preview.next} />
        </Button>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          border: '1px solid lightgrey',
          borderRadius: '5px',
          display: 'flex',
          height: '80px',
          p: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ minWidth: '150px' }}
          width="100%"
        >
          {data[personIndex].map((item, index) => {
            return (
              <Box
                key={index}
                flexGrow={1}
                sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}
              >
                <Typography
                  fontSize="12px"
                  sx={{
                    color: theme.palette.grey['600'],
                    letterSpacing: '1px',
                    mb: 0.5,
                    textTransform: 'uppercase',
                  }}
                  variant="body1"
                >
                  {item.title}
                </Typography>
                <Typography variant="body1">{item.value}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default MappingPreview;
