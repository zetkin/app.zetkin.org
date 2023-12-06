import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

import FieldsPreview from './FieldsPreview';
import messageIds from 'features/import/l10n/messageIds';
import OrgPreview from './OrgPreview';
import PreviewGrid from './PreviewGrid';
import TagsPreview from './TagsPreview';
import { useNumericRouteParams } from 'core/hooks';
import usePersonPreview from 'features/import/hooks/usePersonPreview';
import useSheetSettings from 'features/import/hooks/useSheetSettings';
import { ColumnKind, Sheet } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

const Preview = () => {
  const theme = useTheme();
  const { sheets, selectedSheetIndex, firstRowIsHeaders } = useSheetSettings();
  const [personIndex, setPersonIndex] = useState(0);
  const currentSheet: Sheet = sheets[selectedSheetIndex];
  const { orgId } = useNumericRouteParams();
  const { fields, org, tags } = usePersonPreview(
    currentSheet,
    firstRowIsHeaders ? personIndex + 1 : personIndex,
    orgId
  );
  const messages = useMessages(messageIds);

  const emptyPreview = currentSheet.columns.every(
    (item) => item.selected === false
  );

  const tagColumnSelected = currentSheet.columns.some(
    (column) => column.kind === ColumnKind.TAG && column.selected
  );

  useEffect(() => {
    setPersonIndex(0);
  }, [selectedSheetIndex]);

  return (
    <Box p={2}>
      <Box alignItems="center" display="flex" sx={{ mb: 1.5 }}>
        <Typography sx={{ mr: 2 }} variant="h5">
          <Msg id={messageIds.configuration.preview.title} />
        </Typography>
        <Button
          disabled={personIndex === 0}
          onClick={() =>
            setPersonIndex((prev) => (prev !== 0 ? prev - 1 : prev))
          }
          startIcon={<ArrowBackIos />}
        >
          <Msg id={messageIds.configuration.preview.previous} />
        </Button>
        <Button
          disabled={
            personIndex ===
            currentSheet.rows.length - (firstRowIsHeaders ? 2 : 1)
          }
          endIcon={<ArrowForwardIos />}
          onClick={() =>
            setPersonIndex((prev) =>
              prev < currentSheet.rows.length - 1 ? prev + 1 : prev
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
          height: '98px',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          {emptyPreview &&
            Array(currentSheet.columns.length)
              .fill(null)
              .map((_, index) => {
                return (
                  <Box
                    key={`empty-preview-${index}`}
                    flexGrow={1}
                    sx={{
                      backgroundColor: theme.palette.transparentGrey.light,
                      height: '14px',
                      m: 2,
                    }}
                  />
                );
              })}
          {!emptyPreview && (
            <>
              {currentSheet.columns.map((column, columnIdx) => {
                if (column.selected) {
                  if (column.kind === ColumnKind.UNKNOWN) {
                    const rowValue =
                      currentSheet.rows[
                        firstRowIsHeaders ? personIndex + 1 : personIndex
                      ].data[columnIdx];
                    return (
                      <PreviewGrid
                        emptyLabel={
                          !rowValue
                            ? messages.configuration.preview.noValue()
                            : ''
                        }
                        rowValue={rowValue}
                      />
                    );
                  }
                  if (
                    column.kind === ColumnKind.FIELD ||
                    column.kind === ColumnKind.ID_FIELD
                  ) {
                    return (
                      <FieldsPreview
                        fieldKey={
                          column.kind === ColumnKind.FIELD
                            ? column.field
                            : column.idField
                        }
                        fields={fields}
                        kind={column.kind}
                      />
                    );
                  }
                  if (column.kind === ColumnKind.ORGANIZATION) {
                    return <OrgPreview currentSheet={currentSheet} org={org} />;
                  }
                }
              })}
              {tagColumnSelected && (
                <TagsPreview currentSheet={currentSheet} tags={tags} />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Preview;
