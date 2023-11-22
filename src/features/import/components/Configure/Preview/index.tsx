import { useState } from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, Typography, useTheme } from '@mui/material';

import { ColumnKind } from 'features/import/utils/types';
import { Msg } from 'core/i18n';
import { useAppSelector } from 'core/hooks';

import messageIds from 'features/import/l10n/messageIds';
import useColumnOptions from 'features/import/hooks/useColumnOptions';

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

  const columnOptions = useColumnOptions(6);
  const [personIndex, setPersonIndex] = useState(0);
  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const currentSheet = pendingFile.sheets[pendingFile.selectedSheetIndex];

  const storedMappedData = currentSheet.columns
    .map((column, columnIndex) => {
      if (column.kind === ColumnKind.FIELD) {
        return {
          header: column.field,
          value: currentSheet.rows
            .map((item, rowIndex) => {
              if (currentSheet.firstRowIsHeaders && rowIndex === 0) {
                return;
              }
              return item.data[columnIndex];
            })
            .filter((item) => item !== undefined),
        };
      }
    })
    .filter((item) => item !== undefined);

  return (
    <Box p={2} sx={{ bgColor: 'beige' }}>
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
          {storedMappedData === undefined &&
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
          {storedMappedData?.map((item, index) => {
            let field = '';
            columnOptions.forEach((columnOp) => {
              if (columnOp.value === `field:${item?.header}`) {
                field = columnOp.label;
              }
            });
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
                    backgroundColor:
                      field !== ''
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
                    {field}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    alignItems: 'center',
                    backgroundColor:
                      item?.value[index] !== undefined
                        ? 'transparent'
                        : theme.palette.transparentGrey.light,
                    display: 'flex',
                    height: '14px',
                  }}
                >
                  <Typography variant="body1">{item?.value[index]}</Typography>
                </Box>
              </Box>
            );
          })}
          {/* {data.length > 0 &&
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
            })} */}
        </Box>
      </Box>
    </Box>
  );
};

export default MappingPreview;
