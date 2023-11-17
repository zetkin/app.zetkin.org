import { useState } from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, Typography, useTheme } from '@mui/material';

import { Msg } from 'core/i18n';
import { useAppSelector } from 'core/hooks';

import messageIds from 'features/import/l10n/messageIds';

interface testProp {
  title?: string;
  value?: string;
}

const MappingPreview = () => {
  const theme = useTheme();
  const [data, setData] = useState<testProp[][]>([
    [],
    [{ title: 'title1', value: '1' }],
    [{ title: 'title2' }],
    [{ value: '3' }],
    [
      { title: 'Name', value: 'Haeju' },
      { title: 'Ort', value: 'Linköping' },
      { title: 'Peronal number' },
    ],
  ]);
  const [personIndex, setPersonIndex] = useState(0);
  const sheet = useAppSelector((state) => state.import.pendingFile.sheets[0]);
  const test = sheet.columns
    .filter((item) => item.selected)
    .map((item) => item.title);

  const ye = sheet.rows[0].data
    .map((item, index) => {
      if (item !== null && test.includes(item.toString())) {
        return index;
      }
    })
    .filter((item) => item !== undefined);

  const rows = ye.map((item) =>
    sheet.rows
      .map((row, index) => {
        if (item !== undefined && index !== 0) {
          return row.data[item];
        }
      })
      .filter((item) => item !== undefined)
  );

  const addTitle = (index: number) => {
    const ranNum = Math.floor(Math.random() * 10);
    const yeah = {
      title: `title ${ranNum}`,
    };
    setData((prev) => {
      const newData = [...prev];
      if (newData.length !== 0) {
        newData[personIndex][index] = {
          ...newData[personIndex][index],
          title: `title ${ranNum}`,
        };
      } else {
        newData[personIndex] = [yeah];
      }
      return newData;
    });
  };
  const addValue = (index: number) => {
    const ranNum = Math.floor(Math.random() * 10);
    const yeah = {
      value: `${ranNum}`,
    };
    setData((prev) => {
      const newData = [...prev];
      if (newData.length !== 0) {
        newData[personIndex][index] = {
          ...newData[personIndex][index],
          value: `${ranNum}`,
        };
      } else {
        newData[personIndex] = [yeah];
      }
      return newData;
    });
  };

  return (
    <Box p={2} sx={{ bgColor: 'beige' }}>
      <Button onClick={() => addTitle(2)} sx={{ mr: 2 }} variant="contained">
        Add Title
      </Button>
      <Button color="info" onClick={() => addValue(2)} variant="contained">
        Add value
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
          {data[personIndex].length === 0 &&
            Array(5)
              .fill(2)
              .map((item, index) => {
                return (
                  <Box
                    key={`empty-preview-${index}`}
                    flexGrow={1}
                    sx={{
                      backgroundColor: theme.palette.transparentGrey.light,
                      height: '14px',
                      mr: item,
                    }}
                  />
                );
              })}
          {data.length > 0 &&
            data[personIndex].map((item, index) => {
              return (
                <Box
                  key={index}
                  flexGrow={1}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mr: 2,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: item.title
                        ? 'transparent'
                        : theme.palette.transparentGrey.light,
                      height: '14px',
                      mb: 1,
                    }}
                  >
                    <Typography
                      fontSize="12px"
                      sx={{
                        color: theme.palette.grey['600'],
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                      variant="body1"
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      alignItems: 'center',
                      backgroundColor: item.value
                        ? 'transparent'
                        : theme.palette.transparentGrey.light,
                      display: 'flex',
                      height: '14px',
                    }}
                  >
                    <Typography variant="body1">{item.value}</Typography>
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};

export default MappingPreview;
